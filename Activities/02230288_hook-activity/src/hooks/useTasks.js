// src/hooks/useTasks.js
import { useEffect, useReducer } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import { taskReducer } from "../reducers/taskReducer";

export function useTasks() {
  const [storedTasks, setStoredTasks] = useLocalStorageState("tasks", []);
  // useReducer is preferred here over useState because task updates follow explicit actions.
  const [tasks, dispatch] = useReducer(taskReducer, storedTasks);

  // Persistence effect: reducer state is synchronized to localStorage after task changes.
  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks, setStoredTasks]);

  return { tasks, dispatch };
}
