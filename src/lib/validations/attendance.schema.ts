import { z } from 'zod';

/**
 * Attendance form validation schema
 */
export const attendanceFormSchema = z.object({
  module: z
    .string()
    .min(1, 'Module number is required')
    .regex(/^[1-9]\d*$/, 'Module number must be a valid number and cannot start with 0')
    .refine((val) => Number(val) >= 1, {
      message: 'Module number must be at least 1',
    }),
  mission: z.string().min(1, 'Please select a mission'),
  note: z.string().optional(),
});

export type AttendanceFormData = z.infer<typeof attendanceFormSchema>;
