import { z } from 'zod';
import { emailSchema } from './common.schema';

/**
 * Schema for login (email step)
 */
export const loginEmailSchema = z.object({
  email: emailSchema,
});

export type LoginEmailInput = z.infer<typeof loginEmailSchema>;

/**
 * Schema for OTP verification
 */
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Please enter all 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export type OtpInput = z.infer<typeof otpSchema>;

/**
 * Schema for traditional login (email + password)
 */
export const loginCredentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginCredentialsInput = z.infer<typeof loginCredentialsSchema>;
