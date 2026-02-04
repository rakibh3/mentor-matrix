// Analytics Types based on server/src/modules/analytics/analytics.interface.ts

export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface StudentRisk {
  studentId: string;
  name: string;
  email: string;
  attendanceRate: number;
  riskLevel: RiskLevel;
  totalPresent: number;
  totalAbsent: number;
}

export interface AttendanceStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  attendanceRate: number;
}

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  droppedStudents: number;
  completedStudents: number;
}

export interface CallStats {
  totalCalls: number;
  completedCalls: number;
  missedCalls: number;
  scheduledCalls: number;
  averageDuration: number;
}

export interface RecentActivity {
  student: { _id: string; name: string; email: string };
  status: string;
  mission: number;
  module: number;
  date: string;
}

export interface DashboardStats {
  attendance: AttendanceStats;
  students: StudentStats;
  calls: CallStats;
  recentActivity: RecentActivity[];
}

export interface BatchStats {
  _id: number;
  totalStudents: number;
  activeStudents: number;
  avgAttendance: number;
  avgCompletedModules: number;
}

export interface SrmPerformance {
  srmId: string;
  name: string;
  email: string;
  totalCalls: number;
  callsToday: number;
  callsThisWeek: number;
  assignedStudents: number;
  callsByOutcome: Record<string, number>;
  students?: any[]; // Using any[] for flexibility as the structure is complex and already used in components
}

export interface AttendanceTrend {
  date: string;
  attendanceRate: number;
  totalPresent: number;
  totalAbsent: number;
}

// Response types
export interface GetDashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

export interface GetSrmPerformanceResponse {
  success: boolean;
  data: SrmPerformance;
}

export interface GetAttendanceTrendsResponse {
  success: boolean;
  data: AttendanceTrend[];
}

export interface GetBatchStatsResponse {
  success: boolean;
  data: BatchStats[];
}
