import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types';

export default function TaskDetailScreen({ route, navigation }: any) {
  const { getTaskById, deleteTask } = useTasks();

  // The screen can be opened two ways:
  //  - in-app tap: a full `task` object is passed in params
  //  - notification tap: only a `taskId` is passed, so we look it up here
  const { task: passedTask, taskId } = route.params || {};

  const task: Task | undefined =
    passedTask || (taskId ? getTaskById(taskId) : undefined);

  const handleEdit = () => {
    if (!task) return;

    navigation.navigate('EditTask', {
      task,
    });
  };

  const handleDelete = () => {
    if (!task) return;

    Alert.alert(
      'Delete task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Task not found</Text>
        <Text style={styles.description}>
          This reminder may have been removed.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>

      {!!task.description && (
        <Text style={styles.description}>{task.description}</Text>
      )}

      <Text style={styles.date}>
        {task.repeat === 'daily' ? 'Repeats daily at ' : 'Due '}
        {new Date(task.dueDate).toLocaleString()}
      </Text>

      <Text style={styles.status}>
        Reminder: {task.reminderEnabled ? '🔔 Enabled' : '🔕 Disabled'}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.buttonText}>Edit Task</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  status: {
    marginTop: 20,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 30,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});