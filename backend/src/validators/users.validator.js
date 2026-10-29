import { z } from 'zod';

export const updateRoleSchema = z.object({
  role: z.enum(['CUSTOMER', 'AGENT', 'ADMIN'], {
    errorMap: () => ({ message: 'Role must be CUSTOMER, AGENT, or ADMIN' }),
  }),
});

export const syncUserSchema = z.object({
  clerkId: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
});
