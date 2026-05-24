import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppContext } from '../store/AppContext';

// Screens (we'll create these next)
import LoginScreen from '../screens/LoginScreen';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import CategoryScreen from '../screens/CategoryScreen';

// Define all route params here for type safety
export type RootStackParamList = {
  Login: undefined;
  TaskList: undefined;
  TaskDetail: { taskId: string };
  TaskForm: { taskId?: string }; // no taskId = create, with taskId = edit
  Categories: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { state } = useAppContext();
  const isLoggedIn = !!state.user;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {!isLoggedIn ? (
          // Auth screens
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          // App screens
          <>
            <Stack.Screen
              name="TaskList"
              component={TaskListScreen}
              options={{ title: 'My Tasks' }}
            />
            <Stack.Screen
              name="TaskDetail"
              component={TaskDetailScreen}
              options={{ title: 'Task Detail' }}
            />
            <Stack.Screen
              name="TaskForm"
              component={TaskFormScreen}
              options={({ route }) => ({
                title: route.params?.taskId ? 'Edit Task' : 'New Task',
              })}
            />
            <Stack.Screen
              name="Categories"
              component={CategoryScreen}
              options={{ title: 'Categories' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;