import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must have at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
    confirmPassword: z.string().min(8, 'Confirmation password must match'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirm password do not match',
    path: ['confirmPassword'],
  }),
});