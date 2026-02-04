// useWindowStatus - Hook for fetching window status
import { useQuery } from '@tanstack/react-query';

import { getWindowStatus } from '@/api/endpoints/attendance';
import type { WindowStatusResponse } from '@/api/types/attendance.types';

export const useWindowStatus = () => {
  return useQuery<WindowStatusResponse, Error>({
    queryKey: ['window-status'],
    queryFn: getWindowStatus,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
