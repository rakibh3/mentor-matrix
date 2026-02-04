// useLogCall - Hook for logging outreach calls
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logCall } from '@/api/endpoints/call-history';
import type {
  LogCallRequest,
  LogCallResponse,
} from '@/api/types/call-history.types';

export const useLogCall = () => {
  const queryClient = useQueryClient();

  return useMutation<LogCallResponse, Error, LogCallRequest>({
    mutationFn: logCall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call-history'] });
      queryClient.invalidateQueries({ queryKey: ['student-call-history'] });
      queryClient.invalidateQueries({ queryKey: ['srm-call-history'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-list'] });
      queryClient.invalidateQueries({ queryKey: ['srm-performance'] });
    },
  });
};
