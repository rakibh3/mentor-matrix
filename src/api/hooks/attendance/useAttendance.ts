// useAttendance - Hook for fetching all attendance
import { useQuery } from '@tanstack/react-query';
import { getAttendance } from '../../endpoints/attendance';
import type { GetAttendanceResponse } from '../../types/attendance.types';

export const useAttendance = () => {
  return useQuery<GetAttendanceResponse, Error>({
    queryKey: ['attendance'],
    queryFn: getAttendance,
  });
};
