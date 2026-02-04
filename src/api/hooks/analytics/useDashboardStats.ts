// useDashboardStats - Hook for fetching dashboard statistics
import { useQuery } from '@tanstack/react-query';

import { getDashboardStats } from '@/api/endpoints/analytics';
import type {
  GetDashboardStatsResponse,
} from '@/api/types/analytics.types';

export const useDashboardStats = () => {
  return useQuery<GetDashboardStatsResponse, Error>({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
