import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  Button,
  ActivityIndicator,
  Linking,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  initializeNotifications,
  scheduleTaskReminder,
  cancelTaskReminder,
  cancelAllReminders,
  REMINDER_CHANNEL_ID,
  PermissionState,
} from '../services/NotificationService';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types';

export default function HomeScreen({ navigation }: any) {
  const { tasks, updateTask } = useTasks();
  const [permission, setPermission] = useState<PermissionState>('undetermined');
  const [initializing, setInitializing] = useState(true);
  // Track which task's switch is mid-request to disable it and show progress.
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);

  useEffect(() => {
    const setup = async () => {
      const { permission } = await initializeNotifications();
      setPermission(permission);
      setInitializing(false);
    };
    setup();
  }, []);

  // Demo: fire a notification 10s from now so background delivery can be tested.
  const testNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧪 Test Notification',
        body: 'This should appear in about 10 seconds.',
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
        channelId: REMINDER_CHANNEL_ID,
      },
    });
    Alert.alert('Test scheduled', 'Background the app and wait ~10 seconds.');
  };

  // Enable/disable the reminder for a single task. Cancels any existing
  // schedule first so toggling acts as an update.
  const handleToggleReminder = async (task: Task, value: boolean) => {
    setBusyTaskId(task.id);
    try {
      if (task.notificationId) {
        await cancelTaskReminder(task.notificationId);
      }

      if (value) {
        const id = await scheduleTaskReminder(task);
        if (id) {
          updateTask(task.id, { reminderEnabled: true, notificationId: id });
          Alert.alert(
            'Reminder set',
            task.repeat === 'daily'
              ? `Daily at ${new Date(task.dueDate).toLocaleTimeString()}`
              : `You'll be notified on ${new Date(task.dueDate).toLocaleString()}`
          );
        } else {
          updateTask(task.id, { reminderEnabled: false, notificationId: undefined });
          Alert.alert('Could not schedule', 'Pick a future date/time and try again.');
        }
      } else {
        updateTask(task.id, { reminderEnabled: false, notificationId: undefined });
      }
    } finally {
      setBusyTaskId(null);
    }
  };

  const handleClearAll = async () => {
    await cancelAllReminders();
    tasks.forEach((t) =>
      updateTask(t.id, { reminderEnabled: false, notificationId: undefined })
    );
    Alert.alert('Cleared', 'All scheduled reminders were cancelled.');
  };

  const renderPermissionBanner = () => {
    if (permission === 'granted') {
      return <Text style={styles.okText}>✅ Notifications enabled</Text>;
    }
    if (permission === 'unsupported') {
      return (
        <Text style={styles.warningText}>
          ⚠️ Use a physical device — notifications don't work on this simulator.
        </Text>
      );
    }
    if (permission === 'denied') {
      return (
        <View>
          <Text style={styles.warningText}>
            ⚠️ Notifications are blocked. Enable them in your device Settings to
            receive reminders.
          </Text>
          <View style={{ marginTop: 6, alignSelf: 'flex-start' }}>
            <Button title="Open Settings" onPress={() => Linking.openSettings()} />
          </View>
        </View>
      );
    }
    return (
      <Text style={styles.warningText}>⚠️ Notification permission not granted.</Text>
    );
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetail', { task: item })}
    >
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDate}>
          {item.repeat === 'daily' ? 'Daily at ' : 'Due '}
          {new Date(item.dueDate).toLocaleString()}
        </Text>
        {item.reminderEnabled && <Text style={styles.activeText}>🔔 Reminder active</Text>}
      </View>
      {busyTaskId === item.id ? (
        <ActivityIndicator />
      ) : (
        <Switch
          value={item.reminderEnabled}
          disabled={permission !== 'granted'}
          onValueChange={(value) => handleToggleReminder(item, value)}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {initializing ? (
          <ActivityIndicator />
        ) : (
          renderPermissionBanner()
        )}
        <View style={styles.headerButtons}>
          <Button title="🧪 Test (10s)" onPress={testNotification} />
          <Button title="🗑️ Clear all" onPress={handleClearAll} color="#c0392b" />
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={tasks.length === 0 && { flex: 1, justifyContent: 'center' }}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet. Add one below.</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { marginBottom: 16 },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  warningText: { color: '#c0392b' },
  okText: { color: '#1e8449' },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  taskTitle: { fontSize: 18, fontWeight: '600' },
  taskDate: { color: '#666', marginTop: 5 },
  activeText: { color: '#1e8449', fontSize: 12, marginTop: 4 },
  emptyText: { textAlign: 'center', color: '#999' },
  addButton: {
    backgroundColor: '#4630EB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
