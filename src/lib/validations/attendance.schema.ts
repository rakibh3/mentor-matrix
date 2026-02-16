import { z } from 'zod';

/**
 * Attendance form validation schema
 */
export const attendanceFormSchema = z.object({
  module: z.string().min(1, 'Module number is required'),
  mission: z.string().min(1, 'Please select a mission'),
  note: z.string().optional(),
});

export type AttendanceFormData = z.infer<typeof attendanceFormSchema>;
