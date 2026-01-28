import type { CallRecord } from './call';

export type RiskLevel = 'High' | 'Medium' | 'Low';

// Base student fields shared across all student types
export interface BaseStudent {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Probation' | 'Inactive';
  cohort?: string;
}

export interface Student extends BaseStudent {
  cohort: string;
  progress: number;
  attendanceRate: number;
  color: string;
  currentModule: string;
  phone?: string;
  discord?: string;
  completedAssignments?: string[];
}

export interface FlaggedStudent extends BaseStudent {
  phone: string;
  discord: string;
  risk: RiskLevel;
  reason: string;
  callCount: number;
  callHistory: CallRecord[];
  recentAttendance: boolean[];
  completedAssignments: string[];
  isBlocked?: boolean;
}

// Combined student type used in AdminStudents page (matches mock data structure)
export interface AdminStudent {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  discord: string;
  cohort: string;
  status: 'Active' | 'Probation' | 'Inactive';
  risk: RiskLevel;
  module: string;
  rate: number;
  color: string;
  progress: number;
  completedAssignments: string[];
  recentAttendance: { present: boolean; date: string }[];
  callCount: number;
  callHistory: CallRecord[];
  isBlocked?: boolean;
  reason?: string; // Optional reason field for flagged students
}
