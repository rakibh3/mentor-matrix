// Task Types based on postman_collection.json

export interface Task {
  id: string;
  _id?: string;
  mission: number;
  moduleNumber: number;
  videoNumber?: string;
  guideline: string;
  dueDate: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskRequest {
  mission: number;
  moduleNumber: number;
  videoNumber?: string;
  guideline: string;
  dueDate: string;
  createdBy: string;
}

export interface UpdateTaskRequest {
  mission?: number;
  moduleNumber?: number;
  videoNumber?: string;
  guideline?: string;
  dueDate?: string;
}

export interface TaskResponse {
  success: boolean;
  message?: string;
  data?: Task;
}

export interface TasksResponse {
  success: boolean;
  data: Task[];
}

export interface DeleteTaskResponse {
  success: boolean;
  message: string;
  data?: Task;
}
