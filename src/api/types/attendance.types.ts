// Attendance Types based on postman_collection.json

export interface AttendanceRecord {
  date: string;
  module: string | number;
  topic: string;
  status: 'Present' | 'Absent' | 'ATTENDED' | 'ABSENT';
  note?: string;
}

export interface BackendAttendanceRecord {
  _id: string;
  student: string;
  status: 'ATTENDED' | 'ABSENT';
  mission: number;
  module: number;
  moduleVideo: number;
  date: string;
  note?: string;
}

export interface MarkAttendanceRequest {
  studentID?: string;
  status: 'ATTENDED' | 'ABSENT';
  mission: number;
  module: number;
  moduleVideo: number;
  note?: string;
}

export interface MarkAttendanceResponse {
  success: boolean;
  message: string;
  data?: AttendanceRecord;
}

export interface StudentAttendanceData {
  _id: string;
  name: string;
  email: string;
  attendance: BackendAttendanceRecord[];
  totalPresent: number;
  totalAbsent: number;
  attendancePercentage: number;
}

export interface GetAttendanceResponse {
  success: boolean;
  data: BackendAttendanceRecord[] | StudentAttendanceData | StudentAttendanceData[];
}

export interface UpdateAttendanceRequest {
  status?: 'ATTENDED' | 'ABSENT';
  note?: string;
}

export interface DeleteAttendanceResponse {
  success: boolean;
  message: string;
}

export interface WindowStatusResponse {
  success: boolean;
  data: {
    isOpen: boolean;
    openedAt?: string;
    closedAt?: string;
  };
}

export interface AttendanceFormData {
  videoNumber: string;
  verificationCode: string;
  selectedModule: string;
  note?: string;
}
