// useRequestOtp - Hook for requesting OTP
import { useMutation } from '@tanstack/react-query';
import { requestOtp } from '../../endpoints/auth';
import type { RequestOtpRequest, RequestOtpResponse } from '../../types/auth.types';

export const useRequestOtp = () => {
  return useMutation<RequestOtpResponse, Error, RequestOtpRequest>({
    mutationFn: requestOtp,
  });
};
