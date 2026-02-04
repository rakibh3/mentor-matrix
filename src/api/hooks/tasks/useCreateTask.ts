// useCreateTask - Hook for creating a task
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTask } from '@/api/endpoints/tasks';
import type { CreateTaskRequest, TaskResponse } from '@/api/types/task.types';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<TaskResponse, Error, CreateTaskRequest>({
    mutationFn: createTask,
    onSuccess: (response) => {
      // Synchronously update the 'current' tasks cache
      if (response.data) {
        queryClient.setQueryData(['tasks', 'current'], (old: any) => {
          if (!old) return { success: true, data: [response.data!] };
          const data = Array.isArray(old.data) ? old.data : old.data ? [old.data] : [];
          return {
            ...old,
            data: [response.data!, ...data],
          };
        });
      }

      // Still invalidate to ensure full sync
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
