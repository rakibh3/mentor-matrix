// useUsers - Hook for fetching all users
import { useQuery } from '@tanstack/react-query';

import { getUsers } from '@/api/endpoints/users';
import type { GetUsersResponse } from '@/api/types/user.types';

export const useUsers = () => {
  return useQuery<GetUsersResponse, Error>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};
