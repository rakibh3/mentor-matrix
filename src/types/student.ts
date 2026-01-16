import type { CallRecord } from './call';

export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface Student {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Probation' | 'Inactive';
  cohort: string;
  progress: number;
  attendanceRate: number;
  color: string;
  currentModule: string;
}

export interface FlaggedStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  discord: string;
  status: 'Active' | 'Probation' | 'Inactive';
  risk: RiskLevel;
  reason: string;
  callCount: number;
  callHistory: CallRecord[];
  recentAttendance: boolean[];
  completedAssignments: string[];
  isBlocked?: boolean;
}
