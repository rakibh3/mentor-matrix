// useAttendance - Hook for fetching all attendance
import { useQuery } from '@tanstack/react-query';

import { getAttendance } from '@/api/endpoints/attendance';
import type { GetAttendanceResponse } from '@/api/types/attendance.types';

export const useAttendance = () => {
  return useQuery<GetAttendanceResponse, Error>({
    queryKey: ['attendance'],
    queryFn: getAttendance,
  });
};
