// useUpcomingTask - Hook for fetching upcoming task
import { useQuery } from '@tanstack/react-query';
import { getUpcomingTask } from '../../endpoints/tasks';
import type { TasksResponse } from '../../types/task.types';

export const useUpcomingTask = () => {
  return useQuery<TasksResponse, Error>({
    queryKey: ['tasks', 'upcoming'],
    queryFn: getUpcomingTask,
  });
};
