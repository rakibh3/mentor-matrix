// User Types

import type { User as AuthUser, UserRole } from './auth.types';

export type { AuthUser as User };

export interface UserProfile extends AuthUser {
  createdAt?: string;
  updatedAt?: string;
}

export interface GetUsersResponse {
  success: boolean;
  data: AuthUser[];
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface UpdateUserDataRequest {
  name?: string;
  phone?: string;
  discordUsername?: string;
  smtpConfig?: {
    appPassword?: string;
  };
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data?: AuthUser;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}
