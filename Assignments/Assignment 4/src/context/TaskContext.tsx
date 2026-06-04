import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '../types';

// Central in-memory store for tasks. Kept in context so any screen
// and the notification tap handler can read/update the same list.
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, changes: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => Task | undefined;
}

const TaskCtx = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  // Merge partial changes into a single task by id.
  const updateTask = (id: string, changes: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...changes } : t))
    );
  };

  // Delete a task by id.
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const getTaskById = (id: string) => {
    return tasks.find((t) => t.id === id);
  };

  return (
    <TaskCtx.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTaskById,
      }}
    >
      {children}
    </TaskCtx.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskCtx);

  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }

  return context;
};