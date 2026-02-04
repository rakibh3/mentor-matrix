// Re-export all types from feature folders for backward compatibility

// Admin types
export type {
  BaseStudent,
  Student,
  FlaggedStudent,
  AdminStudent,
  RiskLevel,
} from '@/pages/admin/types/student';
export type { CallOutcome, CallRecord } from '@/pages/admin/types/call';
export type { Task } from '@/pages/admin/types/task';
export type { AnalyticsData } from '@/pages/admin/types/analytics';

// Student types
export type { AttendanceRecord } from '@/pages/student/types';
