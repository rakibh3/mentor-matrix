import { useQuery } from '@tanstack/react-query';

import { getSrms } from '@/api/endpoints/users';
import type { GetUsersResponse } from '@/api/types/user.types';

export const useSrms = () => {
  return useQuery<GetUsersResponse>({
    queryKey: ['users', 'srms'],
    queryFn: getSrms,
  });
};
