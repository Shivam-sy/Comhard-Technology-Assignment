import * as usersService from '../services/users.service.js';

export async function getMe(req, res, next) {
  try {
    const user = await usersService.getCurrentUser(req.user);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const { search, role } = req.query;
    const users = await usersService.listUsers({ search, role });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updated = await usersService.updateUserRole(id, role);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
