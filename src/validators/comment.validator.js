import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    visitorId: z.string().min(5, 'Visitor ID must be provided'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    content: z.string().min(3, 'Comment cannot be empty').max(1000),
  }),
});

export const updateCommentStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'approved', 'rejected']),
  }),
});