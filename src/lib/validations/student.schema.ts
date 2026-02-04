import { z } from 'zod';

import { discordTagSchema, emailSchema, nameSchema, phoneSchema } from './common.schema';

/**
 * Student status values
 */
export const STUDENT_STATUSES = ['Active', 'Probation', 'Inactive'] as const;
export type StudentStatus = (typeof STUDENT_STATUSES)[number];

/**
 * Student status enum schema
 */
export const studentStatusSchema = z.enum(STUDENT_STATUSES, {
  message: 'Please select a valid status',
});

/**
 * Team member role values
 */
export const TEAM_ROLES = ['Moderator', 'Curriculum Dev', 'Admin'] as const;
export type TeamRole = (typeof TEAM_ROLES)[number];

/**
 * Team role enum schema
 */
export const teamRoleSchema = z.enum(TEAM_ROLES, {
  message: 'Please select a valid role',
});

/**
 * Schema for creating a new student
 */
export const createStudentSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  discord: discordTagSchema,
  cohort: z.string().min(1, 'Cohort is required'),
  status: studentStatusSchema.default('Active'),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

/**
 * Schema for editing an existing student
 * Email is optional since it's usually read-only when editing
 */
export const editStudentSchema = z.object({
  name: nameSchema,
  email: emailSchema.optional(),
  cohort: z.string().optional(),
  status: studentStatusSchema,
});

export type EditStudentInput = z.infer<typeof editStudentSchema>;

/**
 * Schema for student registration (self-service)
 */
export const studentRegistrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  discord: discordTagSchema,
});

export type StudentRegistrationInput = z.infer<typeof studentRegistrationSchema>;

/**
 * Schema for inviting a team member
 */
export const inviteTeamMemberSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  role: teamRoleSchema,
});

export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>;
