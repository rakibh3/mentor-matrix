// useDeleteUser - Hook for deleting a user
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../../endpoints/users';
import type { DeleteUserResponse } from '../../types/user.types';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteUserResponse, Error, string>({
    mutationFn: deleteUser,
    onSuccess: (_, userId) => {
      // Update both 'users' and 'attendance-list' query caches
      const keys = [['users'], ['attendance-list']];
      
      keys.forEach(key => {
        queryClient.setQueriesData({ queryKey: key }, (old: any) => {
          if (!old) return old;
          
          const isArray = Array.isArray(old);
          const data = isArray ? old : (old.data || []);
          const normalizedData = Array.isArray(data) ? data : [data];
          
          const updatedData = normalizedData.filter((u: any) => u.id !== userId && u._id !== userId);

          return isArray ? updatedData : { ...old, data: updatedData };
        });
      });
      
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-list'] });
    },
  });
};
