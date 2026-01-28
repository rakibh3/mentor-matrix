// useStudentAttendance - Hook for fetching student attendance
import { useQuery } from '@tanstack/react-query';
import { getStudentAttendance } from '../../endpoints/attendance';
import type { GetAttendanceResponse } from '../../types/attendance.types';

export const useStudentAttendance = () => {
  return useQuery<GetAttendanceResponse, Error>({
    queryKey: ['student-attendance'],
    queryFn: getStudentAttendance,
  });
};
