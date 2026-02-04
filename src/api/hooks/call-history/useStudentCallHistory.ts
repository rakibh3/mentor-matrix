// useStudentCallHistory - Hook for fetching student call history
import { useQuery } from '@tanstack/react-query';

import { getStudentCallHistory } from '@/api/endpoints/call-history';
import type {
  GetCallHistoryResponse,
} from '@/api/types/call-history.types';

export const useStudentCallHistory = (studentId: string) => {
  return useQuery<GetCallHistoryResponse, Error>({
    queryKey: ['student-call-history', studentId],
    queryFn: () => getStudentCallHistory(studentId),
    enabled: !!studentId,
  });
};
