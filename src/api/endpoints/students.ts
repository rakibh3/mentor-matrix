import apiClient from '@/api/client/axios';
import type {
  AssignSrmRequest,
  AssignSrmResponse,
  BlockStudentRequest,
  BlockStudentResponse,
  CreateStudentRequest,
  CreateStudentResponse,
  GetStudentByUserIdResponse,
  GetStudentsResponse,
} from '@/api/types/student.types';

/**
 * Create student (POST /students)
 * Public integrated flow that creates User + Student profile.
 */
export const createStudent = async (data: CreateStudentRequest): Promise<CreateStudentResponse> => {
  const response = await apiClient.post<CreateStudentResponse>('/students', data);
  return response.data;
};

/**
 * Get all students (GET /users/students)
 * Requires ADMIN, SUPER_ADMIN, or SRM role
 */
export const getStudents = async (): Promise<GetStudentsResponse> => {
  const response = await apiClient.get<GetStudentsResponse>('/users/students');
  return response.data;
};

/**
 * Get student by user ID (GET /user/:userId/student)
 * Requires ADMIN, SUPER_ADMIN, or SRM role
 */
export const getStudentByUserId = async (userId: string): Promise<GetStudentByUserIdResponse> => {
  const response = await apiClient.get<GetStudentByUserIdResponse>(`/user/${userId}/student`);
  return response.data;
};

/**
 * Assign SRM to student (PATCH /user/:userId/assign-srm)
 * Requires ADMIN or SUPER_ADMIN role
 */
export const assignSrmToStudent = async (
  userId: string,
  data: AssignSrmRequest
): Promise<AssignSrmResponse> => {
  const response = await apiClient.patch<AssignSrmResponse>(`/user/${userId}/assign-srm`, data);
  return response.data;
};

/**
 * Block/Unblock student (PATCH /user/:userId/block)
 * Requires ADMIN or SUPER_ADMIN role
 */
export const blockStudent = async (
  userId: string,
  data: BlockStudentRequest
): Promise<BlockStudentResponse> => {
  const response = await apiClient.patch<BlockStudentResponse>(`/user/${userId}/block`, data);
  return response.data;
};

/**
 * Bulk assign SRM to students (PATCH /students/assign-srm)
 * Requires ADMIN or SUPER_ADMIN role
 */
export const assignStudentsToSrm = async (data: {
  srmId: string;
  studentIds: string[];
}): Promise<any> => {
  const response = await apiClient.patch<any>('/students/assign-srm', data);
  return response.data;
};
