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
  studentId: string;
  status: 'ATTENDED' | 'ABSENT';
  mission: number;
  module: number;
  date: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarkAttendanceRequest {
  studentId: string;
  status: 'ATTENDED' | 'ABSENT';
  mission: number;
  module: number;
  note?: string;
  verificationCode?: string;
}

export interface MarkAttendanceResponse {
  success: boolean;
  message: string;
  data?: BackendAttendanceRecord;
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
