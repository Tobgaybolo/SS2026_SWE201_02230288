// Core data models for the app.

export type RepeatMode = 'none' | 'daily';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  // 'none' = one-off reminder at dueDate, 'daily' = repeats every day at that time.
  repeat: RepeatMode;
  reminderEnabled: boolean;
  // Id of the scheduled local notification, so we can cancel/update it later.
  notificationId?: string;
}

// Shape of the data payload we attach to notifications to drive navigation.
export interface NotificationData {
  taskId?: string;
  screen?: string;
  [key: string]: unknown;
}
