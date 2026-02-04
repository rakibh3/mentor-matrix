import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignStudentsToSrm } from '@/api/endpoints/students';
import { useToast } from '@/components/ui';

export const useBulkAssignSrm = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: assignStudentsToSrm,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['attendance-list'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      addToast({
        type: 'success',
        title: 'SRM Assigned',
        message: data.message || 'Selected students have been assigned successfully.',
      });
    },
    onError: (error: any) => {
      addToast({
        type: 'error',
        title: 'Assignment Failed',
        message: error.response?.data?.message || 'Could not assign students to SRM.',
      });
    },
  });
};
