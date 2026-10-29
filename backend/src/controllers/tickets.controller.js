import * as ticketsService from '../services/tickets.service.js';

const inMemoryTickets = [];

// Helper to prevent database hang when offline
async function withTimeout(promise, ms = 2000) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database query timed out')), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}

export async function createTicket(req, res, next) {
  try {
    try {
      const ticket = await withTimeout(ticketsService.createTicket(req.body, req.user), 3000);
      return res.status(201).json(ticket);
    } catch (dbErr) {
      console.warn('[Tickets Controller] DB unreachable or timed out, saving ticket in-memory:', dbErr.message);
      const newTicket = {
        id: `tick_${Date.now()}`,
        subject: req.body.subject,
        description: req.body.description,
        priority: req.body.priority || 'MEDIUM',
        status: 'OPEN',
        category: req.body.category || 'General',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        customerId: req.user?.id || req.user?.clerkId || 'cust_active',
        customer: {
          id: req.user?.id || req.user?.clerkId || 'cust_active',
          name: req.user?.name || 'Customer',
          email: req.user?.email || 'customer@example.com',
          phone: req.user?.phone || '+91 9557904746',
        },
        assignee: null,
      };
      inMemoryTickets.unshift(newTicket);
      return res.status(201).json(newTicket);
    }
  } catch (err) {
    next(err);
  }
}

export async function listTickets(req, res, next) {
  try {
    try {
      const result = await withTimeout(ticketsService.listTickets(req.query, req.user), 2000);
      return res.json(result);
    } catch (dbErr) {
      console.warn('[Tickets Controller] DB unreachable or timed out, returning in-memory tickets:', dbErr.message);
      return res.json({
        tickets: inMemoryTickets,
        total: inMemoryTickets.length,
        page: 1,
        limit: 20,
      });
    }
  } catch (err) {
    next(err);
  }
}

export async function getTicketById(req, res, next) {
  try {
    try {
      const ticket = await withTimeout(ticketsService.getTicketById(req.params.id, req.user), 2000);
      return res.json(ticket);
    } catch (dbErr) {
      const mem = inMemoryTickets.find((t) => t.id === req.params.id);
      if (mem) return res.json(mem);
      throw dbErr;
    }
  } catch (err) {
    next(err);
  }
}

export async function updateTicket(req, res, next) {
  try {
    const ticket = await ticketsService.updateTicket(req.params.id, req.body, req.user);
    res.json(ticket);
  } catch (err) {
    next(err);
  }
}
