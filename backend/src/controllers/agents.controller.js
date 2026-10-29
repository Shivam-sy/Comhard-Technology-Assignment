import * as usersService from '../services/users.service.js';

export async function listAgents(req, res, next) {
  try {
    const agents = await usersService.listAgents();
    res.json(agents);
  } catch (err) {
    next(err);
  }
}
