// useUpdateTask - Hook for updating a task
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../../endpoints/tasks';
import type { UpdateTaskRequest, TaskResponse } from '../../types/task.types';
import type { Task } from '../../types/task.types';

interface UpdateTaskParams {
  taskId: string;
  data: UpdateTaskRequest;
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<TaskResponse, Error, UpdateTaskParams>({
    mutationFn: ({ taskId, data }) => updateTask(taskId, data),
    onSuccess: (response) => {
      if (response.data) {
        const updatedTask = response.data;
        
        queryClient.setQueriesData({ queryKey: ['tasks'] }, (old: any) => {
          if (!old || !old.data) return old;
          
          const data = Array.isArray(old.data) ? old.data : [old.data];
          return {
            ...old,
            data: data.map((t: Task) => 
              (t.id === updatedTask.id || t._id === updatedTask.id || t.id === updatedTask._id || t._id === updatedTask._id) 
                ? updatedTask 
                : t
            )
          };
        });
      }
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
