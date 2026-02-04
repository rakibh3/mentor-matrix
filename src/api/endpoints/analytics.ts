import apiClient from '@/api/client/axios';
import type {
  GetAttendanceTrendsResponse,
  GetBatchStatsResponse,
  GetDashboardStatsResponse,
  GetSrmPerformanceResponse,
} from '@/api/types/analytics.types';

/**
 * Get dashboard statistics (GET /analytics/dashboard)
 * Requires ADMIN, SUPER_ADMIN, or SRM role
 */
export const getDashboardStats = async (): Promise<GetDashboardStatsResponse> => {
  const response = await apiClient.get<GetDashboardStatsResponse>('/analytics/dashboard');
  return response.data;
};

/**
 * Get SRM performance metrics (GET /analytics/srm/:srmId)
 * Requires ADMIN, SUPER_ADMIN, or Self (SRM viewing own metrics)
 */
export const getSrmPerformance = async (srmId: string): Promise<GetSrmPerformanceResponse> => {
  const response = await apiClient.get<GetSrmPerformanceResponse>(`/analytics/srm/${srmId}`);
  return response.data;
};

/**
 * Get attendance trends (GET /analytics/attendance/trends)
 * Requires ADMIN, SUPER_ADMIN, or SRM role
 * @param days - Number of days to include (default: 7)
 */
export const getAttendanceTrends = async (
  days: number = 7
): Promise<GetAttendanceTrendsResponse> => {
  const response = await apiClient.get<GetAttendanceTrendsResponse>(
    `/analytics/attendance/trends`,
    { params: { days } }
  );
  return response.data;
};

/**
 * Get batch statistics (GET /analytics/batch)
 * Requires ADMIN, SUPER_ADMIN
 */
export const getBatchStats = async (): Promise<GetBatchStatsResponse> => {
  const response = await apiClient.get<GetBatchStatsResponse>('/analytics/batch');
  return response.data;
};
