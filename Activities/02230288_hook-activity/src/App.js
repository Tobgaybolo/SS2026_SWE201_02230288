// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import TaskInput from "./components/TaskInput";
import ThemeToggleButton from "./components/ThemeToggleButton";
import { useTheme } from "./context/ThemeContext";
import { useTasks } from "./hooks/useTasks";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import "./App.css";

const PHASES = [
  { id: "phase1", title: "Phase 1: useState + basic UI" },
  { id: "phase2", title: "Phase 2: useEffect" },
  { id: "phase3", title: "Phase 3: useContext" },
  { id: "phase4", title: "Phase 4: useReducer" },
  { id: "phase5", title: "Phase 5: Custom hooks" },
];

function Clock() {
  const [now, setNow] = useState(new Date());

  // Subscription pattern with cleanup: interval starts on mount and is cleared on unmount.
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <p className="clock">{now.toLocaleTimeString()}</p>;
}

function PhaseGuide() {
  const [completedPhases, setCompletedPhases] = useLocalStorageState(
    "phaseGuide",
    {}
  );

  const completedCount = PHASES.filter((phase) => completedPhases[phase.id]).length;

  const handleToggle = (phaseId) => {
    setCompletedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  return (
    <section className="phase-guide" aria-label="In-class phase guide">
      <div className="phase-guide-header">
        <h2>In-Class Phase Guide</h2>
        <p>
          {completedCount}/{PHASES.length} complete
        </p>
      </div>
      <ul className="phase-list">
        {PHASES.map((phase) => (
          <li key={phase.id}>
            <label className="phase-item">
              <input
                type="checkbox"
                checked={Boolean(completedPhases[phase.id])}
                onChange={() => handleToggle(phase.id)}
              />
              <span>{phase.title}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

function App() {
  const { theme } = useTheme();
  // Task state is managed by useReducer inside useTasks because there are multiple action types.
  const { tasks, dispatch } = useTasks();
  // Filter state is simple local UI state, so useState is enough here.
  const [filter, setFilter] = useState("all");

  const activeCount = tasks.filter((task) => !task.done).length;

  // Side effect for persistence to the browser tab title. Dependency avoids stale values.
  useEffect(() => {
    document.title = `Tasks: ${activeCount} active`;
  }, [activeCount]);

  const filteredTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.done);
    }
    if (filter === "completed") {
      return tasks.filter((task) => task.done);
    }
    return tasks;
  }, [filter, tasks]);

  const isRecentTask = (createdAt) => {
    if (!createdAt) return false;
    return Date.now() - createdAt <= 5 * 60 * 1000;
  };

  return (
    <div className={`app app-${theme}`}>
      <header className="header">
        <h1>Reactive Task Board</h1>
        <Clock />
        <ThemeToggleButton />
      </header>

      <PhaseGuide />

      <TaskInput
        onAddTask={(task) => dispatch({ type: "ADD_TASK", task })}
      />

      <section className="toolbar">
        <p>
          Total: {tasks.length} | Active: {activeCount}
        </p>
        <div className="filters">
          <button
            type="button"
            className={filter === "all" ? "is-active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={filter === "active" ? "is-active" : ""}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            type="button"
            className={filter === "completed" ? "is-active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
        <div className="actions">
          <button type="button" onClick={() => dispatch({ type: "MARK_ALL_DONE" })}>
            Mark all done
          </button>
          <button type="button" onClick={() => dispatch({ type: "CLEAR_COMPLETED" })}>
            Clear completed
          </button>
        </div>
      </section>

      <ul className="task-list">
        {filteredTasks.map((t) => (
          <li key={t.id} className="task-item">
            <label className="task-label">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => dispatch({ type: "TOGGLE_DONE", id: t.id })}
              />
              <span className={t.done ? "task-title done" : "task-title"}>
                {t.title}
              </span>
              <span className="priority-badge">{t.priority}</span>
              {isRecentTask(t.createdAt) && (
                <span className="new-badge">New (5m)</span>
              )}
            </label>
            <button
              type="button"
              onClick={() => dispatch({ type: "DELETE_TASK", id: t.id })}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {filteredTasks.length === 0 && <p>No tasks in this view.</p>}
    </div>
  );
}

export default App;
