// useSrmCallHistory - Hook for fetching SRM call history
import { useQuery } from '@tanstack/react-query';

import { getSrmCallHistory } from '@/api/endpoints/call-history';
import type {
  GetCallHistoryResponse,
} from '@/api/types/call-history.types';

export const useSrmCallHistory = (srmId: string) => {
  return useQuery<GetCallHistoryResponse, Error>({
    queryKey: ['srm-call-history', srmId],
    queryFn: () => getSrmCallHistory(srmId),
    enabled: !!srmId,
  });
};
