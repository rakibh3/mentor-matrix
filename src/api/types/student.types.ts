// Student Types based on server/src/modules/student/student.interface.ts

export interface Student {
  _id: string;
  userId: string;
  phone: string;
  discordUsername?: string;
  assignedSrmId?: string;
  isBlocked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStudentRequest {
  name: string;
  email: string;
  phone: string;
  discordUsername: string;
  enrollmentDate?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  notes?: string;
}

export interface CreateStudentResponse {
  success: boolean;
  message: string;
  data?: Student;
}

export interface StudentWithUser extends Student {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Response types
export interface GetStudentsResponse {
  success: boolean;
  data: StudentWithUser[];
}

export interface GetStudentByUserIdResponse {
  success: boolean;
  data: StudentWithUser;
}

export interface AssignSrmRequest {
  srmId: string;
}

export interface AssignSrmResponse {
  success: boolean;
  message: string;
  data?: Student;
}

export interface BlockStudentRequest {
  isBlocked: boolean;
}

export interface BlockStudentResponse {
  success: boolean;
  message: string;
  data?: Student;
}

export interface BulkAssignSrmRequest {
  srmId: string;
  studentIds: string[];
}

export interface BulkAssignSrmResponse {
  success: boolean;
  message: string;
  data?: any;
}
