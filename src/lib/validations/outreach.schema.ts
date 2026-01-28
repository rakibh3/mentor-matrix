import { z } from 'zod';

/**
 * Schema for outreach email
 */
export const outreachEmailSchema = z.object({
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be 200 characters or less'),
  body: z
    .string()
    .min(1, 'Message body is required')
    .max(5000, 'Message must be 5000 characters or less'),
});

export type OutreachEmailInput = z.infer<typeof outreachEmailSchema>;
