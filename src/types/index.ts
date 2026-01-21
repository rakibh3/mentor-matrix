// Re-export all types from feature folders for backward compatibility

// Admin types
export type { BaseStudent, Student, FlaggedStudent, AdminStudent, RiskLevel } from '@/features/admin/types/student';
export type { CallOutcome, CallRecord } from '@/features/admin/types/call';
export type { Task } from '@/features/admin/types/task';
export type { AnalyticsData } from '@/features/admin/types/analytics';

// Student types
export type { AttendanceRecord } from '@/features/student/types/attendance';
