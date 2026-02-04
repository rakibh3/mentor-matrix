// useAttendanceTrends - Hook for fetching attendance trends
import { useQuery } from '@tanstack/react-query';

import { getAttendanceTrends } from '@/api/endpoints/analytics';
import type {
  GetAttendanceTrendsResponse,
} from '@/api/types/analytics.types';

export const useAttendanceTrends = (days: number = 7) => {
  return useQuery<GetAttendanceTrendsResponse, Error>({
    queryKey: ['attendance-trends', days],
    queryFn: () => getAttendanceTrends(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
