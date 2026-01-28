// Auth Types based on postman_collection.json

export type UserRole = 'admin' | 'student' | 'superadmin' | 'ADMIN' | 'STUDENT';

export interface User {
  email: string;
  role: UserRole;
  name?: string;
  discord?: string;
  discordUsername?: string;
  phone?: string;
  _id?: string;
}

export interface RequestOtpRequest {
  email: string;
}

export interface RequestOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  phone: string;
  discordUsername: string;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  data?: User;
}
