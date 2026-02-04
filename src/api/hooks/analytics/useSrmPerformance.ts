// useSrmPerformance - Hook for fetching SRM performance metrics
import { useQuery } from '@tanstack/react-query';

import { getSrmPerformance } from '@/api/endpoints/analytics';
import type {
  GetSrmPerformanceResponse,
} from '@/api/types/analytics.types';

export const useSrmPerformance = (srmId: string) => {
  return useQuery<GetSrmPerformanceResponse, Error>({
    queryKey: ['srm-performance', srmId],
    queryFn: () => getSrmPerformance(srmId),
    enabled: !!srmId,
  });
};
