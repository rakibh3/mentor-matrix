// useCurrentTask - Hook for fetching current task
import { useQuery } from '@tanstack/react-query';

import { getCurrentTask } from '@/api/endpoints/tasks';
import type { TasksResponse } from '@/api/types/task.types';

export const useCurrentTask = () => {
  return useQuery<TasksResponse, Error>({
    queryKey: ['tasks', 'current'],
    queryFn: getCurrentTask,
  });
};
