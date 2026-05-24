export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  categoryId: string;
  createdAt?: string;
}

export interface User {
  token: string;
  name: string;
}

export interface FilterState {
  status: string;
  categoryId: string;
  searchQuery: string;
}

// Global app state shape
export interface AppState {
  tasks: Task[];
  categories: Category[];
  user: User | null;
  filters: FilterState;
  loading: boolean;
  error: string | null;
}

// All possible actions for the reducer
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> };