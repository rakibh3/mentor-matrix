import { z } from 'zod';

/**
 * Attendance form validation schema
 */
export const attendanceFormSchema = z.object({
  videoNumber: z.string().min(1, 'Video number is required'),
  verificationCode: z.string().min(1, 'Verification code is required'),
  selectedModule: z.string().min(1, 'Please select a module'),
  note: z.string().optional().or(z.literal('')),
});

export type AttendanceFormData = z.infer<typeof attendanceFormSchema>;
