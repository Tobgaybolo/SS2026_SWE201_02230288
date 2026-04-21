// src/components/ThemeToggleButton.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === "light" ? "dark" : "light"} mode
    </button>
  );
}

export default ThemeToggleButton;
