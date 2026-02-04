import { z } from 'zod';

/**
 * Common validation patterns used across schemas
 */

// Email validation with custom error messages
export const emailSchema = z
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

// Phone number validation (Bangladesh format: starts with 01, 11 digits)
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^01\d{9}$/, 'Phone number must start with 01 and be 11 digits');

// Optional phone (for forms where it's not required)
export const optionalPhoneSchema = z
  .string()
  .regex(/^01\d{9}$/, 'Phone number must start with 01 and be 11 digits')
  .optional()
  .or(z.literal(''));

// Name validation
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters');

// Password validation with strength requirements
export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Simple password (for demo/testing)
export const simplePasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(6, 'Password must be at least 6 characters');

// URL validation
export const urlSchema = z.string().url('Please enter a valid URL').optional().or(z.literal(''));

// Discord tag validation
export const discordTagSchema = z
  .string()
  .min(1, 'Discord tag is required')
  .regex(
    /^.{2,32}(#\d{4})?$/,
    'Please enter a valid Discord tag (e.g., username or username#1234)'
  );
