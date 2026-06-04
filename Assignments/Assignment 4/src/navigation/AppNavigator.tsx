import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { AddTaskScreen, HomeScreen, TaskDetailScreen } from '../screens';
import { RootStackParamList } from '../types/navigation';
import { NotificationData } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Global navigation ref so the notification handlers (which live outside the
// component tree of a single screen) can trigger navigation.
const navigationRef = createNavigationContainerRef<RootStackParamList>();

export default function AppNavigator() {
  // Foreground toast state: shown briefly when a notification arrives while
  // the app is open and visible.
  const [foregroundText, setForegroundText] = useState<string | null>(null);

  // A single tap can reach us twice on cold start: once via the live
  // response listener and once via useLastNotificationResponse. We track the
  // notification identifiers we've already acted on so we navigate only once.
  const handledTapIds = useRef<Set<string>>(new Set());

  // Handles a tapped notification by deep-linking to the relevant task.
  const handleTap = (response: Notifications.NotificationResponse | null | undefined) => {
    if (!response) return;

    const requestId = response.notification.request.identifier;
    if (handledTapIds.current.has(requestId)) return; // already navigated for this tap
    handledTapIds.current.add(requestId);

    const data = response.notification.request.content.data as NotificationData;
    if (!data?.taskId) return;

    const go = () =>
      navigationRef.navigate('TaskDetail', { taskId: String(data.taskId) });
    if (navigationRef.isReady()) {
      go();
    } else {
      // Cold start: wait until the container is ready before navigating.
      const timer = setInterval(() => {
        if (navigationRef.isReady()) {
          clearInterval(timer);
          go();
        }
      }, 100);
    }
  };

  // Handles the case where the app was opened by tapping a notification
  // from a fully-closed state (cold start).
  const lastResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    handleTap(lastResponse);
  }, [lastResponse]);

  useEffect(() => {
    // FOREGROUND: notification received while app is open -> show a toast.
    const receivedSub = Notifications.addNotificationReceivedListener((n) => {
      const title = n.request.content.title ?? 'Notification';
      setForegroundText(title);
      setTimeout(() => setForegroundText(null), 4000);
    });

    // TAPPED (foreground/background): user tapped a notification -> navigate.
    const responseSub = Notifications.addNotificationResponseReceivedListener(handleTap);

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Home' }}
          />
          <Stack.Screen
            name="AddTask"
            component={AddTaskScreen}
            options={{ title: 'New Task' }}
          />
          <Stack.Screen
            name="TaskDetail"
            component={TaskDetailScreen}
            options={{ title: 'Task Details' }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {foregroundText && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>🔔 {foregroundText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
  },
  toastText: { color: 'white', textAlign: 'center' },
});
