import apiClient from '@/api/client/axios';
import type {
  GetCallHistoryResponse,
  LogCallRequest,
  LogCallResponse,
} from '@/api/types/call-history.types';

/**
 * Log outreach call (POST /calls)
 * Requires ADMIN, SUPER_ADMIN, or SRM role
 */
export const logCall = async (data: LogCallRequest): Promise<LogCallResponse> => {
  const response = await apiClient.post<LogCallResponse>('/call-history', data);
  return response.data;
};

/**
 * Get student call history (GET /calls/student/:studentId)
 * Requires ADMIN, SUPER_ADMIN, or Assigned SRM role
 */
export const getStudentCallHistory = async (studentId: string): Promise<GetCallHistoryResponse> => {
  const response = await apiClient.get<GetCallHistoryResponse>(`/call-history/student/${studentId}`);
  return response.data;
};

/**
 * Get SRM call history (GET /call-history/srm/:srmId)
 * Requires ADMIN, SUPER_ADMIN, or Self (SRM viewing own history)
 */
export const getSrmCallHistory = async (srmId: string): Promise<GetCallHistoryResponse> => {
  const response = await apiClient.get<GetCallHistoryResponse>(`/call-history/srm/${srmId}`);
  return response.data;
};
