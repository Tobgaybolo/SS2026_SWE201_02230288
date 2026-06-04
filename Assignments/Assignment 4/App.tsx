import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TaskProvider } from './src/context/TaskContext';
import AppNavigator from './src/navigation/AppNavigator';

// App root: wraps the navigator in the TaskProvider so every screen and the
// notification tap handler share one task list. (Previously missing, which
// caused useTasks() to throw on launch.)
export default function App() {
  return (
    <SafeAreaProvider>
      <TaskProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </TaskProvider>
    </SafeAreaProvider>
  );
}
