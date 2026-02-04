// useUpdateUserRole - Hook for updating user role
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUserRole } from '@/api/endpoints/users';
import type { UpdateUserResponse, UpdateUserRoleRequest } from '@/api/types/user.types';

interface UpdateUserRoleParams {
  userId: string;
  data: UpdateUserRoleRequest;
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserResponse, Error, UpdateUserRoleParams>({
    mutationFn: ({ userId, data }) => updateUserRole(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
