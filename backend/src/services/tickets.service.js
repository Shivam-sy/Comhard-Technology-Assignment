import { prisma } from '../config/db.js';

/**
 * Computes overdue status according to the exact business rule:
 * status !== 'RESOLVED' && createdAt < currentTime - 24 hours
 */
export function computeIsOverdue(ticket) {
  if (ticket.status === 'RESOLVED') {
    return false;
  }
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return new Date(ticket.createdAt) < twentyFourHoursAgo;
}

/**
 * Enriches ticket object or array with computed properties (isOverdue).
 */
export function enrichTicket(ticket) {
  if (!ticket) return null;
  return {
    ...ticket,
    isOverdue: computeIsOverdue(ticket),
  };
}

export async function createTicket(data, currentUser) {
  const { subject, description, priority = 'MEDIUM' } = data;

  return prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.create({
      data: {
        subject,
        description,
        priority,
        status: 'OPEN',
        customerId: currentUser.id,
      },
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    await tx.activityLog.create({
      data: {
        ticketId: ticket.id,
        actorId: currentUser.id,
        action: 'TICKET_CREATED',
        newValue: 'OPEN',
      },
    });

    return enrichTicket(ticket);
  });
}

export async function listTickets(query, currentUser) {
  const {
    search,
    status,
    priority,
    assigneeId,
    sortBy = 'updatedAt',
    sortOrder = 'desc',
    isOverdue,
    page = 1,
    limit = 50,
  } = query;

  const where = {};

  // 1. Role-based scoping
  if (currentUser.role === 'CUSTOMER') {
    where.customerId = currentUser.id;
  }

  // 2. Status filter
  if (status && status !== 'ALL') {
    where.status = status;
  }

  // 3. Priority filter
  if (priority && priority !== 'ALL') {
    where.priority = priority;
  }

  // 4. Assignee filter (for staff)
  if (assigneeId) {
    if (assigneeId === 'unassigned') {
      where.assigneeId = null;
    } else if (assigneeId === 'me') {
      where.assigneeId = currentUser.id;
    } else {
      where.assigneeId = assigneeId;
    }
  }

  // 5. Overdue filter
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (isOverdue === 'true') {
    where.status = { not: 'RESOLVED' };
    where.createdAt = { lt: twentyFourHoursAgo };
  } else if (isOverdue === 'false') {
    // Either resolved OR created within last 24h
    where.OR = [
      { status: 'RESOLVED' },
      { createdAt: { gte: twentyFourHoursAgo } },
    ];
  }

  // 6. Search filter (subject, customer name, customer email)
  if (search && search.trim()) {
    const term = search.trim();
    const searchConditions = [
      { subject: { contains: term, mode: 'insensitive' } },
      { customer: { name: { contains: term, mode: 'insensitive' } } },
      { customer: { email: { contains: term, mode: 'insensitive' } } },
    ];

    if (where.OR) {
      where.AND = [
        { OR: where.OR },
        { OR: searchConditions },
      ];
      delete where.OR;
    } else {
      where.OR = searchConditions;
    }
  }

  // 7. Sorting
  const orderBy = [];
  if (sortBy === 'priority') {
    // Prisma sorts enum alphabetically by default; we sort by priority field
    orderBy.push({ priority: sortOrder });
  } else if (sortBy === 'createdAt') {
    orderBy.push({ createdAt: sortOrder });
  } else {
    orderBy.push({ updatedAt: sortOrder });
  }

  const [total, tickets] = await Promise.all([
    prisma.ticket.count({ where }),
    prisma.ticket.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        customer: {
          select: { id: true, name: true, email: true },
        },
        assignee: {
          select: { id: true, name: true, email: true, role: true },
        },
        _count: {
          select: { entries: true },
        },
      },
    }),
  ]);

  return {
    tickets: tickets.map(enrichTicket),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getTicketById(ticketId, currentUser) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      customer: {
        select: { id: true, name: true, email: true },
      },
      assignee: {
        select: { id: true, name: true, email: true, role: true },
      },
      _count: {
        select: { entries: true, activities: true },
      },
    },
  });

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.status = 404;
    throw error;
  }

  // Customer access check
  if (currentUser.role === 'CUSTOMER' && ticket.customerId !== currentUser.id) {
    const error = new Error('Access denied to this ticket');
    error.status = 403;
    throw error;
  }

  return enrichTicket(ticket);
}

export async function updateTicket(ticketId, updates, currentUser) {
  // Check ticket existence & fetch current state
  const existingTicket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      assignee: { select: { id: true, name: true } },
    },
  });

  if (!existingTicket) {
    const error = new Error('Ticket not found');
    error.status = 404;
    throw error;
  }

  // Permissions check: Customers cannot change status, priority, or assignee
  if (currentUser.role === 'CUSTOMER') {
    const error = new Error('Customers cannot update ticket properties');
    error.status = 403;
    throw error;
  }

  // Agent assignment restrictions
  if (updates.assigneeId !== undefined) {
    if (currentUser.role === 'AGENT' && updates.assigneeId !== null && updates.assigneeId !== currentUser.id) {
      const error = new Error('Support agents can only claim tickets for themselves');
      error.status = 403;
      throw error;
    }

    if (updates.assigneeId) {
      const targetAgent = await prisma.user.findUnique({
        where: { id: updates.assigneeId },
      });
      if (!targetAgent || (targetAgent.role !== 'AGENT' && targetAgent.role !== 'ADMIN')) {
        const error = new Error('Assignee must be an active support agent or admin');
        error.status = 400;
        throw error;
      }
    }
  }

  return prisma.$transaction(async (tx) => {
    const activityData = [];
    const updateData = {};

    // 1. Status change
    if (updates.status && updates.status !== existingTicket.status) {
      updateData.status = updates.status;
      activityData.push({
        ticketId,
        actorId: currentUser.id,
        action: 'STATUS_CHANGED',
        oldValue: existingTicket.status,
        newValue: updates.status,
      });
    }

    // 2. Priority change
    if (updates.priority && updates.priority !== existingTicket.priority) {
      updateData.priority = updates.priority;
      activityData.push({
        ticketId,
        actorId: currentUser.id,
        action: 'PRIORITY_CHANGED',
        oldValue: existingTicket.priority,
        newValue: updates.priority,
      });
    }

    // 3. Assignee change
    if (updates.assigneeId !== undefined && updates.assigneeId !== existingTicket.assigneeId) {
      updateData.assigneeId = updates.assigneeId;

      let newAgentName = 'Unassigned';
      if (updates.assigneeId) {
        const newAgent = await tx.user.findUnique({ where: { id: updates.assigneeId } });
        newAgentName = newAgent ? newAgent.name : 'Unknown Agent';
      }

      const oldAgentName = existingTicket.assignee ? existingTicket.assignee.name : 'Unassigned';

      activityData.push({
        ticketId,
        actorId: currentUser.id,
        action: existingTicket.assigneeId ? 'REASSIGNED' : 'ASSIGNED',
        oldValue: oldAgentName,
        newValue: newAgentName,
      });
    }

    // If nothing changed, return existing
    if (Object.keys(updateData).length === 0) {
      return enrichTicket(existingTicket);
    }

    const updated = await tx.ticket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    if (activityData.length > 0) {
      await tx.activityLog.createMany({
        data: activityData,
      });
    }

    return enrichTicket(updated);
  });
}

export async function listEntries(ticketId, currentUser) {
  // Ensure ticket exists and user has access
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.status = 404;
    throw error;
  }

  if (currentUser.role === 'CUSTOMER' && ticket.customerId !== currentUser.id) {
    const error = new Error('Access denied to this ticket');
    error.status = 403;
    throw error;
  }

  // Customers NEVER receive INTERNAL_NOTE
  const where = { ticketId };
  if (currentUser.role === 'CUSTOMER') {
    where.type = 'PUBLIC_REPLY';
  }

  return prisma.ticketEntry.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  });
}

export async function createEntry(ticketId, data, currentUser) {
  const { content, type = 'PUBLIC_REPLY' } = data;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.status = 404;
    throw error;
  }

  // Access validation
  if (currentUser.role === 'CUSTOMER') {
    if (ticket.customerId !== currentUser.id) {
      const error = new Error('Access denied to this ticket');
      error.status = 403;
      throw error;
    }
    // Customers can ONLY create PUBLIC_REPLY
    if (type === 'INTERNAL_NOTE') {
      const error = new Error('Customers cannot create internal notes');
      error.status = 403;
      throw error;
    }
  }

  return prisma.$transaction(async (tx) => {
    const entry = await tx.ticketEntry.create({
      data: {
        ticketId,
        authorId: currentUser.id,
        content,
        type,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    // Touch ticket updatedAt
    await tx.ticket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() },
    });

    // Record activity
    await tx.activityLog.create({
      data: {
        ticketId,
        actorId: currentUser.id,
        action: type === 'INTERNAL_NOTE' ? 'INTERNAL_NOTE_ADDED' : 'PUBLIC_REPLY_ADDED',
        newValue: `${currentUser.name} posted a ${type === 'INTERNAL_NOTE' ? 'private note' : 'reply'}`,
      },
    });

    return entry;
  });
}

export async function getTicketHistory(ticketId, currentUser) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) {
    const error = new Error('Ticket not found');
    error.status = 404;
    throw error;
  }

  if (currentUser.role === 'CUSTOMER' && ticket.customerId !== currentUser.id) {
    const error = new Error('Access denied to this ticket');
    error.status = 403;
    throw error;
  }

  const where = { ticketId };
  // Privacy rule: Customers only view customer-safe events
  if (currentUser.role === 'CUSTOMER') {
    where.action = {
      notIn: ['INTERNAL_NOTE_ADDED', 'REASSIGNED'],
    };
  }

  return prisma.activityLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      actor: {
        select: { id: true, name: true, role: true },
      },
    },
  });
}
