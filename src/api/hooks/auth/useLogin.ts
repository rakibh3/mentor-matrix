// useLogin - Hook for login (OTP verification)
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { verifyOtp } from '@/api/endpoints/auth';
import type { VerifyOtpRequest, VerifyOtpResponse } from '@/api/types/auth.types';

export const useLogin = () => {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpRequest>({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Store token and user data in cookies
        Cookies.set('token', data.data.accessToken, { expires: 7, path: '/' });
        Cookies.set('user_data', JSON.stringify(data.data.user), { expires: 7, path: '/' });
      }
    },
  });
};
