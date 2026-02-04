// useDeleteTask - Hook for deleting a task
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTask } from '@/api/endpoints/tasks';
import type { DeleteTaskResponse, Task } from '@/api/types/task.types';

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteTaskResponse, Error, string>({
    mutationFn: deleteTask,
    onSuccess: (_, taskId) => {
      // Use setQueriesData to update any query starting with ['tasks']
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (old: any) => {
        if (!old || !old.data) return old;

        const data = Array.isArray(old.data) ? old.data : [old.data];
        return {
          ...old,
          data: data.filter((t: Task) => t.id !== taskId && t._id !== taskId),
        };
      });

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
