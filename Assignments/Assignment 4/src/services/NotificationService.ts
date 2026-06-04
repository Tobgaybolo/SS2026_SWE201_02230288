import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { Task } from '../types';

// Base URL of our backend. Configurable via app.json -> expo.extra.apiUrl
// so no environment-specific URL is hard-coded into the logic.
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

// Android channel used for all task reminders.
export const REMINDER_CHANNEL_ID = 'reminders';

export type PermissionState = 'granted' | 'denied' | 'undetermined' | 'unsupported';

// How the app behaves when a notification arrives while in the FOREGROUND.
// SDK 54 replaced the deprecated `shouldShowAlert` with banner/list flags.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Resolve the EAS projectId in a way that works across managed/bare setups.
function getProjectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants as any).easConfig?.projectId
  );
}

// Create the Android notification channel. Safe to call repeatedly.
export const setupAndroidChannel = async (): Promise<void> => {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
    name: 'Task Reminders',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#4630EB',
    sound: 'default',
  });
};

// Ask for notification permission and report the outcome to the caller
// so the UI can show appropriate messaging.
export const requestPermissions = async (): Promise<PermissionState> => {
  if (!Device.isDevice) {
    // Push tokens / reliable notifications only work on physical devices.
    return 'unsupported';
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus === 'granted') return 'granted';
  if (finalStatus === 'denied') return 'denied';
  return 'undetermined';
};

// Register the device for REMOTE push: fetch the Expo push token and send it
// to the backend along with a device identifier so the server can target it.
export const registerForRemotePush = async (): Promise<string | null> => {
  try {
    const projectId = getProjectId();
    const { data: pushToken } = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );

    try {
      await axios.post(`${API_URL}/register`, {
        token: pushToken,
        deviceId: Device.osInternalBuildId || Device.modelName || 'unknown-device',
        platform: Platform.OS,
      });
    } catch (err) {
      // Backend may be offline during local testing; remote push just won't work,
      // but local notifications still do. Log without breaking the app.
      console.warn('Could not reach backend to register push token:', API_URL);
    }

    return pushToken;
  } catch (error) {
    console.error('Error getting Expo push token:', error);
    return null;
  }
};

// Convenience bootstrap: channel + permission + token in one call.
export const initializeNotifications = async (): Promise<{
  permission: PermissionState;
  pushToken: string | null;
}> => {
  await setupAndroidChannel();
  const permission = await requestPermissions();
  let pushToken: string | null = null;
  if (permission === 'granted') {
    pushToken = await registerForRemotePush();
  }
  return { permission, pushToken };
};

// Schedule a LOCAL reminder for a task. Supports a one-off date trigger
// or a repeating daily trigger. Returns the notification id (to cancel later).
export const scheduleTaskReminder = async (task: Task): Promise<string | null> => {
  try {
    const triggerDate = new Date(task.dueDate);

    const content: Notifications.NotificationContentInput = {
      title: `⏰ Reminder: ${task.title}`,
      body: task.description || 'This task is due now!',
      sound: 'default',
      // Data payload drives deep-link navigation when the notification is tapped.
      data: { taskId: task.id, screen: 'TaskDetail' },
    };

    if (task.repeat === 'daily') {
      // Repeat every day at the chosen hour/minute.
      const id = await Notifications.scheduleNotificationAsync({
        content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: triggerDate.getHours(),
          minute: triggerDate.getMinutes(),
          channelId: REMINDER_CHANNEL_ID,
        },
      });
      return id;
    }

    // One-off reminder: must be in the future.
    if (triggerDate.getTime() <= Date.now()) {
      console.warn('Reminder time is in the past; not scheduling.');
      return null;
    }

    const id = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: REMINDER_CHANNEL_ID,
      },
    });
    return id;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return null;
  }
};

// Cancel a single scheduled reminder by id.
export const cancelTaskReminder = async (notificationId: string): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error cancelling reminder:', error);
  }
};

// Cancel every scheduled reminder (used by "Clear All").
export const cancelAllReminders = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error cancelling all reminders:', error);
  }
};
