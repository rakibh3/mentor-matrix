// useMarkAttendance - Hook for marking attendance
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAttendance } from '@/api/endpoints/attendance';
import type { MarkAttendanceRequest, MarkAttendanceResponse } from '@/api/types/attendance.types';

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkAttendanceResponse, Error, MarkAttendanceRequest>({
    mutationFn: markAttendance,
    onSuccess: () => {
      // Invalidate attendance queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
    },
  });
};
