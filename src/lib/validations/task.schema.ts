import { z } from 'zod';

/**
 * Module numbers available
 */
export const MODULE_NUMBERS = [1, 2, 3, 4, 5, 6] as const;
export type ModuleNumber = typeof MODULE_NUMBERS[number];

/**
 * Mission numbers available
 */
export const MISSION_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type MissionNumber = typeof MISSION_NUMBERS[number];

/**
 * Schema for editing a task/assignment
 */
export const editTaskSchema = z.object({
  moduleNumber: z.coerce
    .number()
    .min(1, 'Module number is required')
    .max(6, 'Module number must be between 1 and 6'),
  mission: z.coerce
    .number()
    .min(1, 'Mission number is required')
    .max(8, 'Mission number must be between 1 and 8'),
  guideline: z
    .string()
    .min(1, 'Guideline is required')
    .max(2000, 'Guideline must be 2000 characters or less'),
  dueDate: z.string().min(1, 'Due date is required'),
});

export type EditTaskInput = z.infer<typeof editTaskSchema>;

/**
 * Schema for creating a new task/assignment
 */
export const createTaskSchema = editTaskSchema;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
