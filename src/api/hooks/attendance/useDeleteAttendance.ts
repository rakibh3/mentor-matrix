// useDeleteAttendance - Hook for deleting attendance
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAttendance } from '../../endpoints/attendance';
import type { DeleteAttendanceResponse } from '../../types/attendance.types';

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteAttendanceResponse, Error, string>({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
    },
  });
};
