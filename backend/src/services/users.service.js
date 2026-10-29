import { prisma } from '../config/db.js';

export async function getCurrentUser(user) {
  return prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      clerkId: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function listAgents() {
  return prisma.user.findMany({
    where: {
      role: { in: ['AGENT', 'ADMIN'] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { name: 'asc' },
  });
}

export async function listUsers({ search, role }) {
  const where = {};
  if (role && ['CUSTOMER', 'AGENT', 'ADMIN'].includes(role)) {
    where.role = role;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.user.findMany({
    where,
    select: {
      id: true,
      clerkId: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          customerTickets: true,
          assignedTickets: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateUserRole(userId, newRole) {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existing) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      clerkId: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });
}
