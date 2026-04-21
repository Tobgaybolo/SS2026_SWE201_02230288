// src/hooks/useLocalStorageState.js
import { useState, useEffect } from "react";

// Reusable custom hook: one place for localStorage state read/write logic.
export function useLocalStorageState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
