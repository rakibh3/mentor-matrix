// useMarkAbsent - Hook for marking students as absent
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markAbsent } from '@/api/endpoints/attendance';

export const useMarkAbsent = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, { date: string }>({
    mutationFn: markAbsent,
    onSuccess: () => {
      // Invalidate attendance queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
      queryClient.invalidateQueries({ queryKey: ['flaggedStudents'] });
    },
  });
};
