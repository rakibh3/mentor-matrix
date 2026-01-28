// useOpenWindow - Hook for opening attendance window
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { openAttendanceWindow } from '@/api/endpoints/attendance';

export const useOpenWindow = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error>({
    mutationFn: openAttendanceWindow,
    onSuccess: () => {
      // Invalidate window-status query to refetch the new state
      queryClient.invalidateQueries({ queryKey: ['window-status'] });
    },
  });
};
