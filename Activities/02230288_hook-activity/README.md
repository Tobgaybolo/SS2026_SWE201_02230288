# Hook Activity Revision Guide

This classroom activity demonstrates useState, useEffect, useContext, useReducer, and custom hooks in a single task board app.

## Learning Outcomes Map

Students should be able to:

1. Explain when to use useState vs useReducer for state.
Where to see it:
- Simple local UI state with useState in [src/App.js](src/App.js).
- Complex task state transitions handled by useReducer through [src/hooks/useTasks.js](src/hooks/useTasks.js) and [src/reducers/taskReducer.js](src/reducers/taskReducer.js).

2. Implement useEffect for fetching, persistence, or subscriptions with correct cleanup.
Where to see it:
- Subscription with cleanup in Clock interval in [src/App.js](src/App.js).
- Persistence effect syncing tasks to localStorage in [src/hooks/useTasks.js](src/hooks/useTasks.js).
- Persistence effect inside reusable storage hook in [src/hooks/useLocalStorageState.js](src/hooks/useLocalStorageState.js).
Note:
- This project currently focuses on persistence and subscriptions. Add a small fetch exercise if you want explicit network data loading practice.

3. Create and consume a context with useContext to avoid prop drilling.
Where to see it:
- Context creation and provider in [src/context/ThemeContext.jsx](src/context/ThemeContext.jsx).
- Provider wrapping the app in [src/index.js](src/index.js).
- Context consumption in App and Theme button in [src/App.js](src/App.js) and [src/components/ThemeToggleButton.jsx](src/components/ThemeToggleButton.jsx).

4. Design a reducer with clear action types and pure state transitions.
Where to see it:
- Action-based reducer transitions in [src/reducers/taskReducer.js](src/reducers/taskReducer.js).
- Dispatch calls from UI events in [src/App.js](src/App.js).

5. Extract repeated hook logic into a custom hook and reuse it across components.
Where to see it:
- Reusable localStorage hook in [src/hooks/useLocalStorageState.js](src/hooks/useLocalStorageState.js).
- Hook reuse in [src/hooks/useTasks.js](src/hooks/useTasks.js) and [src/App.js](src/App.js) for phase guide progress.

## In-Class Flow

1. Phase 1: useState + basic UI
- Task input title and priority controls.

2. Phase 2: useEffect
- Document title update with active task count.
- localStorage persistence.
- Clock subscription with cleanup.

3. Phase 3: useContext
- Theme toggling through ThemeProvider and useTheme.

4. Phase 4: useReducer
- Task actions: add, toggle, clear completed, delete, mark all done.

5. Phase 5: Custom hooks
- useLocalStorageState and useTasks extraction.

## Mini Exercises Included

- Filter tasks by All, Active, Completed.
- Recent badge for tasks created in the last 5 minutes.
- Live clock in the header.

## Common Mistakes to Discuss

- Mutating reducer state instead of returning new arrays or objects.
- Incorrect useEffect dependencies causing infinite loops or stale values.
- Using useContext without wrapping with the matching provider.
- Performing side effects inside reducers.
- Calling hooks conditionally instead of unconditionally at top level.

## Run the Activity

1. Start the app:
- npm start

2. Run tests:
- npm test
