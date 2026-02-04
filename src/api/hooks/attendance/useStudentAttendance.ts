// useStudentAttendance - Hook for fetching student attendance
import { useQuery } from '@tanstack/react-query';

import { getStudentAttendance } from '@/api/endpoints/attendance';
import type { GetAttendanceResponse } from '@/api/types/attendance.types';

export const useStudentAttendance = () => {
  return useQuery<GetAttendanceResponse, Error>({
    queryKey: ['student-attendance'],
    queryFn: getStudentAttendance,
  });
};
