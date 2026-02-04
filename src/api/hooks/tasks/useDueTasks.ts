// useDueTasks - Hook for fetching due tasks
import { useQuery } from '@tanstack/react-query';

import { getDueTasks } from '@/api/endpoints/tasks';
import type { TasksResponse } from '@/api/types/task.types';

export const useDueTasks = () => {
  return useQuery<TasksResponse, Error>({
    queryKey: ['tasks', 'due'],
    queryFn: getDueTasks,
  });
};
