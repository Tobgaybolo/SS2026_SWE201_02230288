// src/reducers/taskReducer.js
export const initialTaskState = [];

// Reducer stays pure: no side effects, only next-state calculation from state + action.
export function taskReducer(state = initialTaskState, action) {
  switch (action.type) {
    case "LOAD_FROM_STORAGE":
      return Array.isArray(action.tasks) ? action.tasks : [];
    case "ADD_TASK":
      return [...state, action.task];
    case "TOGGLE_DONE":
      return state.map((t) =>
        t.id === action.id ? { ...t, done: !t.done } : t
      );
    case "CLEAR_COMPLETED":
      return state.filter((t) => !t.done);
    case "DELETE_TASK":
      return state.filter((t) => t.id !== action.id);
    case "MARK_ALL_DONE":
      return state.map((t) => ({ ...t, done: true }));
    default:
      return state;
  }
}
