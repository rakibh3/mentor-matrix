// useRequestOtp - Hook for requesting OTP
import { useMutation } from '@tanstack/react-query';

import { requestOtp } from '@/api/endpoints/auth';
import type { RequestOtpRequest, RequestOtpResponse } from '@/api/types/auth.types';

export const useRequestOtp = () => {
  return useMutation<RequestOtpResponse, Error, RequestOtpRequest>({
    mutationFn: requestOtp,
  });
};
