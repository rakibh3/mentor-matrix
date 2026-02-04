// useRegister - Hook for user registration
import { useMutation } from '@tanstack/react-query';

import { registerUser } from '@/api/endpoints/auth';
import type { RegisterUserRequest, RegisterUserResponse } from '@/api/types/auth.types';

export const useRegister = () => {
  return useMutation<RegisterUserResponse, Error, RegisterUserRequest>({
    mutationFn: registerUser,
  });
};
