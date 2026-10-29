import * as dashboardService from '../services/dashboard.service.js';

export async function getDashboard(req, res, next) {
  try {
    try {
      const data = await dashboardService.getDashboardMetrics(req.user);
      return res.json(data);
    } catch (dbErr) {
      console.warn('[Dashboard Controller] DB unreachable, returning fallback metrics:', dbErr.message);
      return res.json({
        metrics: {
          total: 0,
          open: 0,
          inProgress: 0,
          waitingOnCustomer: 0,
          resolved: 0,
          urgent: 0,
        },
        recentTickets: [],
      });
    }
  } catch (err) {
    next(err);
  }
}
