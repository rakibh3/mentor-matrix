// useUpdateAttendance - Hook for updating attendance
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateAttendance } from '@/api/endpoints/attendance';
import type { MarkAttendanceResponse, UpdateAttendanceRequest } from '@/api/types/attendance.types';

interface UpdateAttendanceParams {
  attendanceId: string;
  data: UpdateAttendanceRequest;
}

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkAttendanceResponse, Error, UpdateAttendanceParams>({
    mutationFn: ({ attendanceId, data }) => updateAttendance(attendanceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
    },
  });
};
