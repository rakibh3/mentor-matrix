// useUpdateUserData - Hook for updating user data
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserData } from '../../endpoints/users';
import type { UpdateUserDataRequest, UpdateUserResponse } from '../../types/user.types';

interface UpdateUserDataParams {
  userId: string;
  data: UpdateUserDataRequest;
}

export const useUpdateUserData = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserResponse, Error, UpdateUserDataParams>({
    mutationFn: ({ userId, data }) => updateUserData(userId, data),
    onSuccess: (response, variables) => {
      const updatedUser = response.data;
      if (updatedUser) {
        // Update both 'users' and 'attendance-list' query caches
        const keys = [['users'], ['attendance-list']];
        
        keys.forEach(key => {
          queryClient.setQueriesData({ queryKey: key }, (old: any) => {
            if (!old) return old;
            
            // Handle different data structures (array or success/data object)
            const isArray = Array.isArray(old);
            const data = isArray ? old : (old.data || []);
            const normalizedData = Array.isArray(data) ? data : [data];
            
            const updatedData = normalizedData.map((u: any) => {
              const matches = u.id === variables.userId || u._id === variables.userId || u.email === updatedUser.email;
              return matches ? { ...u, ...updatedUser } : u;
            });

            return isArray ? updatedData : { ...old, data: updatedData };
          });
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['attendance-list'] });
    },
  });
};
