export interface AttendanceRecord {
  date: string;
  module: string;
  topic: string;
  status: 'Present' | 'Absent';
}
