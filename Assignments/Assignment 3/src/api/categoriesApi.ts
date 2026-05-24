import apiClient from './config';
import { Category } from '../store/types';

// GET /categories — fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/categories');
  return response.data;
};

// POST /categories — create a new category
export const createCategory = async (
  category: Omit<Category, 'id' | 'createdAt'>
): Promise<Category> => {
  const response = await apiClient.post<Category>('/categories', {
    ...category,
    createdAt: new Date().toISOString(),
  });
  return response.data;
};

// DELETE /categories/:id — delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};