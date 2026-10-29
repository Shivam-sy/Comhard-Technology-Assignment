import { prisma } from '../config/db.js';
import { enrichTicket } from './tickets.service.js';

export async function getDashboardMetrics(currentUser) {
  const whereScope = {};

  if (currentUser.role === 'CUSTOMER') {
    whereScope.customerId = currentUser.id;
  }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    total,
    open,
    inProgress,
    waitingOnCustomer,
    resolved,
    urgent,
    overdue,
    recentTickets,
  ] = await Promise.all([
    // Total tickets
    prisma.ticket.count({ where: whereScope }),

    // Open tickets
    prisma.ticket.count({
      where: { ...whereScope, status: 'OPEN' },
    }),

    // In-progress tickets
    prisma.ticket.count({
      where: { ...whereScope, status: 'IN_PROGRESS' },
    }),

    // Waiting on customer
    prisma.ticket.count({
      where: { ...whereScope, status: 'WAITING_ON_CUSTOMER' },
    }),

    // Resolved tickets
    prisma.ticket.count({
      where: { ...whereScope, status: 'RESOLVED' },
    }),

    // Urgent tickets
    prisma.ticket.count({
      where: { ...whereScope, priority: 'URGENT' },
    }),

    // Overdue tickets rule: status !== RESOLVED && createdAt < currentTime - 24 hours
    prisma.ticket.count({
      where: {
        ...whereScope,
        status: { not: 'RESOLVED' },
        createdAt: { lt: twentyFourHoursAgo },
      },
    }),

    // Recent 5 tickets
    prisma.ticket.findMany({
      where: whereScope,
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);

  // For Agents, also calculate their personally assigned active workload
  let myAssignedActiveCount = 0;
  if (currentUser.role === 'AGENT' || currentUser.role === 'ADMIN') {
    myAssignedActiveCount = await prisma.ticket.count({
      where: {
        assigneeId: currentUser.id,
        status: { not: 'RESOLVED' },
      },
    });
  }

  return {
    metrics: {
      total,
      open,
      inProgress,
      waitingOnCustomer,
      resolved,
      urgent,
      overdue,
      myAssignedActive: myAssignedActiveCount,
    },
    recentTickets: recentTickets.map(enrichTicket),
    userRole: currentUser.role,
  };
}
