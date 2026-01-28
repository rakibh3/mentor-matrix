// Users API Endpoints
import apiClient from '../client/axios';
import type {
  GetUsersResponse,
  UpdateUserRoleRequest,
  UpdateUserDataRequest,
  UpdateUserResponse,
  DeleteUserResponse,
} from '../types/user.types';

/**
 * Get all users (GET /users)
 * Based on postman_collection.json line 125-139
 */
export const getUsers = async (): Promise<GetUsersResponse> => {
  const response = await apiClient.get<GetUsersResponse>('/users');
  return response.data;
};

/**
 * Update user role (PATCH /user/:userId/role)
 * Based on postman_collection.json line 142-173
 */
export const updateUserRole = async (
  userId: string,
  data: UpdateUserRoleRequest
): Promise<UpdateUserResponse> => {
  const response = await apiClient.patch<UpdateUserResponse>(
    `/user/${userId}/role`,
    data
  );
  return response.data;
};

/**
 * Update user data (PATCH /user/:userId/data)
 * Based on postman_collection.json line 176-207
 */
export const updateUserData = async (
  userId: string,
  data: UpdateUserDataRequest
): Promise<UpdateUserResponse> => {
  const response = await apiClient.patch<UpdateUserResponse>(
    `/user/${userId}/data`,
    data
  );
  return response.data;
};

/**
 * Delete user (DELETE /user/:userId)
 * Based on postman_collection.json line 210-232
 */
export const deleteUser = async (
  userId: string
): Promise<DeleteUserResponse> => {
  const response = await apiClient.delete<DeleteUserResponse>(
    `/user/${userId}`
  );
  return response.data;
};
