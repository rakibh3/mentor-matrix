// useDueTasks - Hook for fetching due tasks
import { useQuery } from '@tanstack/react-query';
import { getDueTasks } from '../../endpoints/tasks';
import type { TasksResponse } from '../../types/task.types';

export const useDueTasks = () => {
  return useQuery<TasksResponse, Error>({
    queryKey: ['tasks', 'due'],
    queryFn: getDueTasks,
  });
};
