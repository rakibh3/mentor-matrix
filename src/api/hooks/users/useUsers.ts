// useUsers - Hook for fetching all users
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../endpoints/users';
import type { GetUsersResponse } from '../../types/user.types';

export const useUsers = () => {
  return useQuery<GetUsersResponse, Error>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};
