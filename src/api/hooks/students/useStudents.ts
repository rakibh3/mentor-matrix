// useStudents - Hook for fetching all students
import { useQuery } from '@tanstack/react-query';

import { getStudents } from '@/api/endpoints/students';
import type { GetStudentsResponse } from '@/api/types/student.types';

export const useStudents = () => {
  return useQuery<GetStudentsResponse, Error>({
    queryKey: ['students'],
    queryFn: getStudents,
  });
};
