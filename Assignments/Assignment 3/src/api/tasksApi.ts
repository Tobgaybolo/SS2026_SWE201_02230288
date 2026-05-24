import apiClient from './config';
import { Task } from '../store/types';

// GET /tasks — fetch all tasks
export const fetchTasks = async (): Promise<Task[]> => {
  const response = await apiClient.get<Task[]>('/tasks');
  return response.data;
};

// GET /tasks/:id — fetch a single task
export const fetchTaskById = async (id: string): Promise<Task> => {
  const response = await apiClient.get<Task>(`/tasks/${id}`);
  return response.data;
};

// POST /tasks — create a new task
export const createTask = async (
  task: Omit<Task, 'id' | 'createdAt'>
): Promise<Task> => {
  const response = await apiClient.post<Task>('/tasks', {
    ...task,
    createdAt: new Date().toISOString(),
  });
  return response.data;
};

// PUT /tasks/:id — update an existing task
export const updateTask = async (
  id: string,
  task: Partial<Omit<Task, 'id' | 'createdAt'>>
): Promise<Task> => {
  const response = await apiClient.put<Task>(`/tasks/${id}`, task);
  return response.data;
};

// DELETE /tasks/:id — delete a task
export const deleteTask = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/tasks/${id}`);
  } catch (error) {
    // Mockapi sometimes returns 404 on delete even when successful
    // We only re-throw if it's not a 404
    if (error instanceof Error && error.message.includes('not found')) {
      return; // treat as success
    }
    throw error;
  }
};