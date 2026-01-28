// Tasks API Endpoints
import apiClient from '../client/axios';
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
  TasksResponse,
  DeleteTaskResponse,
} from '../types/task.types';

/**
 * Create task (POST /task)
 * Based on postman_collection.json line 439-462
 */
export const createTask = async (
  data: CreateTaskRequest
): Promise<TaskResponse> => {
  const response = await apiClient.post<TaskResponse>('/task', data);
  return response.data;
};

/**
 * Update task (PATCH /task/:taskId)
 * Based on postman_collection.json line 465-495
 */
export const updateTask = async (
  taskId: string,
  data: UpdateTaskRequest
): Promise<TaskResponse> => {
  const response = await apiClient.patch<TaskResponse>(
    `/task/${taskId}`,
    data
  );
  return response.data;
};

/**
 * Get current task (GET /task/current)
 * Based on postman_collection.json line 498-513
 */
export const getCurrentTask = async (): Promise<TasksResponse> => {
  const response = await apiClient.get<TasksResponse>('/task/current');
  return response.data;
};

/**
 * Get upcoming task (GET /task/upcoming)
 * Based on postman_collection.json line 516-531
 */
export const getUpcomingTask = async (): Promise<TasksResponse> => {
  const response = await apiClient.get<TasksResponse>('/task/upcoming');
  return response.data;
};

/**
 * Get due tasks (GET /task/due)
 * Based on postman_collection.json line 534-549
 */
export const getDueTasks = async (): Promise<TasksResponse> => {
  const response = await apiClient.get<TasksResponse>('/task/due');
  return response.data;
};

/**
 * Delete task (DELETE /task/:taskId)
 * Based on postman_collection.json line 552-574
 */
export const deleteTask = async (
  taskId: string
): Promise<DeleteTaskResponse> => {
  const response = await apiClient.delete<DeleteTaskResponse>(
    `/task/${taskId}`
  );
  return response.data;
};
