import { getAuth } from '@clerk/express';
import { prisma } from '../config/db.js';
import { env } from '../config/env.js';

/**
 * Synchronizes or fetches the local PostgreSQL User record for the authenticated identity.
 */
export async function syncUser(req, res, next) {
  try {
    let clerkId = null;
    let email = null;
    let name = null;

    // 1. Check for live Clerk authentication session
    try {
      const auth = getAuth(req);
      if (auth && auth.userId) {
        clerkId = auth.userId;
      }
    } catch (clerkErr) {
      // Clerk middleware might not have authenticated this request
    }

    // 2. Local/Test fallback: Support dev user header for testing or standalone demo mode
    if (!clerkId && (req.headers['x-dev-user-id'] || req.headers['x-dev-role'])) {
      const devUserId = req.headers['x-dev-user-id'];
      const devRole = req.headers['x-dev-role']; // only for explicit mock testing fixtures

      if (devUserId) {
        let existingUser = await prisma.user.findFirst({
          where: {
            OR: [
              { id: devUserId },
              { clerkId: devUserId },
              { email: devUserId }
            ]
          }
        });

        if (existingUser) {
          req.user = existingUser;
          return next();
        }

        // Create dev user if specified
        clerkId = devUserId.startsWith('user_') ? devUserId : `user_${devUserId}`;
        email = req.headers['x-dev-user-email'] || `${devUserId}@supportdesk.internal`;
        name = req.headers['x-dev-user-name'] || devUserId;
      }
    }

    // 3. Fallback: Parse Bearer token format if mock token passed in tests
    const authHeader = req.headers.authorization;
    if (!clerkId && authHeader && authHeader.startsWith('Bearer mock_')) {
      const mockIdentifier = authHeader.replace('Bearer mock_', '');
      let existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { id: mockIdentifier },
            { clerkId: mockIdentifier },
            { email: mockIdentifier }
          ]
        }
      });
      if (existingUser) {
        req.user = existingUser;
        return next();
      }
      clerkId = `user_${mockIdentifier}`;
      email = `${mockIdentifier}@example.com`;
      name = mockIdentifier;
    }

    if (!clerkId) {
      // No authenticated identity found
      req.user = null;
      return next();
    }

    // 4. Query or synchronize with local PostgreSQL User table
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      // Look up if user exists by email if email is provided
      if (email) {
        user = await prisma.user.findUnique({ where: { email } });
      }

      if (user) {
        // Link clerkId to existing local user
        user = await prisma.user.update({
          where: { id: user.id },
          data: { clerkId },
        });
      } else {
        // Create new local user; ALWAYS default to CUSTOMER
        user = await prisma.user.create({
          data: {
            clerkId,
            email: email || `${clerkId}@example.com`,
            name: name || 'Support Customer',
            role: 'CUSTOMER', // Strict security rule: new signups always default to CUSTOMER
          },
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware] Sync user error:', error);
    next(error);
  }
}

/**
 * Guard: Requires any authenticated user.
 */
export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication required',
    });
  }
  next();
}

/**
 * Guard: Requires support staff (AGENT or ADMIN).
 */
export function requireStaff(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication required',
    });
  }
  if (req.user.role !== 'AGENT' && req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Forbidden: Support staff access required',
    });
  }
  next();
}

/**
 * Guard: Requires system administrator (ADMIN only).
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication required',
    });
  }
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Forbidden: Administrator privileges required',
    });
  }
  next();
}
