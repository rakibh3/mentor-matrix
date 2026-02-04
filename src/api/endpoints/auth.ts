// Auth API Endpoints
import Cookies from 'js-cookie';

import apiClient from '@/api/client/axios';
import type {
  RegisterUserRequest,
  RegisterUserResponse,
  RequestOtpRequest,
  RequestOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '@/api/types/auth.types';

/**
 * Request OTP (POST /auth/request-otp)
 * Based on postman_collection.json line 13-41
 */
export const requestOtp = async (data: RequestOtpRequest): Promise<RequestOtpResponse> => {
  const response = await apiClient.post<RequestOtpResponse>('/auth/request-otp', data);
  return response.data;
};

/**
 * Verify OTP (POST /auth/verify-otp)
 * Based on postman_collection.json line 44-87
 */
export const verifyOtp = async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
  const response = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', data);
  return response.data;
};

/**
 * Register User (POST /auth/register)
 * Based on postman_collection.json line 90-117
 */
export const registerUser = async (data: RegisterUserRequest): Promise<RegisterUserResponse> => {
  const response = await apiClient.post<RegisterUserResponse>('/auth/register', data);
  return response.data;
};

/**
 * Logout - Clear cookies
 */
export const logout = (): void => {
  Cookies.remove('token', { path: '/' });
  Cookies.remove('user_data', { path: '/' });
};
