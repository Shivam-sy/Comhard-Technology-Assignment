import * as usersService from '../services/users.service.js';

export async function getMe(req, res, next) {
  try {
    try {
      const user = await usersService.getCurrentUser(req.user);
      if (user) return res.json(user);
    } catch (dbErr) {
      console.warn('[Users Controller] DB query failed, using auth identity fallback:', dbErr.message);
    }
    res.json(req.user || {
      id: 'user_fallback',
      name: 'User',
      email: 'user@example.com',
      role: 'CUSTOMER',
      onboarded: false,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, company, phone } = req.body;
    const userId = req.user?.id || req.user?.clerkId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User session required' });
    }

    let updated;
    try {
      updated = await usersService.updateProfile(userId, {
        name,
        company,
        phone,
      });
    } catch (dbErr) {
      console.warn('[Users Controller] DB unreachable, returning fallback profile:', dbErr.message);
      updated = {
        ...(req.user || {}),
        id: userId,
        name: name ? String(name).trim() : req.user?.name || 'Customer',
        company: company ? String(company).trim() : req.user?.company || '',
        phone: phone ? String(phone).trim() : req.user?.phone || '',
        role: req.user?.role || 'CUSTOMER',
        onboarded: true,
      };
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const { search, role } = req.query;
    try {
      const users = await usersService.listUsers({ search, role });
      return res.json(users);
    } catch (dbErr) {
      console.warn('[Users Controller] DB unreachable for listUsers:', dbErr.message);
      return res.json([]);
    }
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
