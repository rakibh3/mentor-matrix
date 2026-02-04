// useBatchStats - Hook for fetching batch statistics
import { useQuery } from '@tanstack/react-query';

import { getBatchStats } from '@/api/endpoints/analytics';
import type {
  GetBatchStatsResponse,
} from '@/api/types/analytics.types';

export const useBatchStats = () => {
  return useQuery<GetBatchStatsResponse, Error>({
    queryKey: ['batch-stats'],
    queryFn: getBatchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
