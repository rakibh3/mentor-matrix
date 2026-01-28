// useCloseWindow - Hook for closing attendance window
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { closeAttendanceWindow } from '@/api/endpoints/attendance';

export const useCloseWindow = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error>({
    mutationFn: closeAttendanceWindow,
    onSuccess: () => {
      // Invalidate window-status query to refetch the new state
      queryClient.invalidateQueries({ queryKey: ['window-status'] });
    },
  });
};
