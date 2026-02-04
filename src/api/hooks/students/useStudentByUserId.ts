// useStudentByUserId - Hook for fetching student by user ID
import { useQuery } from '@tanstack/react-query';

import { getStudentByUserId } from '@/api/endpoints/students';
import type {
  GetStudentByUserIdResponse,
} from '@/api/types/student.types';

export const useStudentByUserId = (userId: string) => {
  return useQuery<GetStudentByUserIdResponse, Error>({
    queryKey: ['student', userId],
    queryFn: () => getStudentByUserId(userId),
    enabled: !!userId,
  });
};
