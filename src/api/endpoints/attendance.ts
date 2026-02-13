// Attendance API Endpoints
import apiClient from '@/api/client/axios';
import type {
  DeleteAttendanceResponse,
  GetAttendanceResponse,
  MarkAttendanceRequest,
  MarkAttendanceResponse,
  UpdateAttendanceRequest,
  WindowStatusResponse,
} from '@/api/types/attendance.types';

export const markAttendance = async (
  data: MarkAttendanceRequest
): Promise<MarkAttendanceResponse> => {
  const response = await apiClient.post<MarkAttendanceResponse>('/create-attendance', data);
  return response.data;
};

export const createAttendance = markAttendance;

/**
 * Get all attendance records (GET /get-attendance)
 * Based on postman_collection.json line 265-279
 */
export const getAttendance = async (): Promise<GetAttendanceResponse> => {
  const response = await apiClient.get<GetAttendanceResponse>('/get-attendance');
  return response.data;
};

/**
 * Get SRM assigned students attendance (GET /get-attendance/srm)
 */
export const getSrmAttendance = async (): Promise<GetAttendanceResponse> => {
  const response = await apiClient.get<GetAttendanceResponse>('/get-attendance/srm');
  return response.data;
};

/**
 * Get student attendance (GET /get-attendance/student)
 * Based on postman_collection.json line 282-297
 */
export const getStudentAttendance = async (): Promise<GetAttendanceResponse> => {
  const response = await apiClient.get<GetAttendanceResponse>('/get-attendance/student');
  return response.data;
};

/**
 * Update attendance (PATCH /update-attendance/:attendanceId)
 * Based on postman_collection.json line 300-330
 */
export const updateAttendance = async (
  attendanceId: string,
  data: UpdateAttendanceRequest
): Promise<MarkAttendanceResponse> => {
  const response = await apiClient.patch<MarkAttendanceResponse>(
    `/update-attendance/${attendanceId}`,
    data
  );
  return response.data;
};

/**
 * Delete attendance (DELETE /delete-attendance/:attendanceId)
 * Based on postman_collection.json line 333-355
 */
export const deleteAttendance = async (attendanceId: string): Promise<DeleteAttendanceResponse> => {
  const response = await apiClient.delete<DeleteAttendanceResponse>(
    `/delete-attendance/${attendanceId}`
  );
  return response.data;
};

/**
 * Open attendance window (POST /open-window)
 * Based on postman_collection.json line 357-371
 */
export const openAttendanceWindow = async (): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>('/open-window');
  return response.data;
};

/**
 * Close attendance window (POST /close-window)
 * Based on postman_collection.json line 374-388
 */
export const closeAttendanceWindow = async (): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>('/close-window');
  return response.data;
};

/**
 * Get window status (GET /window-status)
 * Based on postman_collection.json line 391-405
 */
export const getWindowStatus = async (): Promise<WindowStatusResponse> => {
  const response = await apiClient.get<WindowStatusResponse>('/window-status');
  return response.data;
};

/**
 * Mark absent (POST /mark-absent)
 * Based on postman_collection.json line 408-432
 */
export const markAbsent = async (data: {
  date: string;
}): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    '/mark-absent',
    data
  );
  return response.data;
};
