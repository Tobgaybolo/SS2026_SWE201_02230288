// theme.tsx
import React, { createContext, useContext, useState } from 'react';

// Define theme objects for light and dark modes
const themes = {
  light: {
    background: '#f9fafb',
    text: '#111827',
  },
  dark: {
    background: '#020617',
    text: '#e5e7eb',
  },
};

// Step 1: CREATE CONTEXT
// createContext() creates a context object that will hold theme data
// The default value is passed as a parameter (used as fallback if no Provider wraps component)
const ThemeContext = createContext({
  theme: themes.light,
  toggle: () => {},
});

// Step 2: CREATE CUSTOM HOOK WITH useContext()
// useContext() accesses the context value from the nearest Provider
// This custom hook allows components to easily access theme data
export const useTheme = () => useContext(ThemeContext);

// Step 3: CREATE PROVIDER COMPONENT
// The Provider component wraps the app and provides the context value to all children
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Create the context value object with current theme and toggle function
  const value = {
    theme: themes[mode],
    toggle: () => setMode(prev => (prev === 'light' ? 'dark' : 'light')),
  };

  // Provide the context value to all child components
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
