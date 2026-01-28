// useUpdateUserRole - Hook for updating user role
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserRole } from '../../endpoints/users';
import type { UpdateUserRoleRequest, UpdateUserResponse } from '../../types/user.types';

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
