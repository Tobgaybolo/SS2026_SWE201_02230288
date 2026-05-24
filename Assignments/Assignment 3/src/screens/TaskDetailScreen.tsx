import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppContext } from '../store/AppContext';
import { fetchTaskById } from '../api/tasksApi';
import { deleteTask } from '../api/tasksApi';
import { Task } from '../store/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TaskDetail'>;
  route: RouteProp<RootStackParamList, 'TaskDetail'>;
};

const STATUS_COLORS: Record<string, string> = {
  'todo': '#f59e0b',
  'in-progress': '#6366f1',
  'done': '#10b981',
};

const PRIORITY_COLORS: Record<string, string> = {
  'low': '#10b981',
  'medium': '#f59e0b',
  'high': '#ef4444',
};

const PRIORITY_ICONS: Record<string, string> = {
  'low': '🟢',
  'medium': '🟡',
  'high': '🔴',
};

const STATUS_ICONS: Record<string, string> = {
  'todo': '📋',
  'in-progress': '⚡',
  'done': '✅',
};

const TaskDetailScreen = ({ navigation, route }: Props) => {
  const { taskId } = route.params;
  const { state, dispatch } = useAppContext();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get category details from global state
  const category = task
    ? state.categories.find((c) => c.id === task.categoryId)
    : null;

  const loadTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTaskById(taskId);
      setTask(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [taskId]);

  // Re-fetch when coming back from edit screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTask();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task?.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteTask(taskId);
              dispatch({ type: 'DELETE_TASK', payload: taskId });
              navigation.goBack();
            } catch (err) {
              Alert.alert(
                'Error',
                err instanceof Error ? err.message : 'Failed to delete task.'
              );
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading task...</Text>
      </View>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadTask}>
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Should not happen but guard anyway
  if (!task) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Title section */}
      <View style={styles.titleCard}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.dateText}>Created {formatDate(task.createdAt)}</Text>
      </View>

      {/* Status + Priority row */}
      <View style={styles.row}>
        {/* Status */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardLabel}>Status</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLORS[task.status] + '22' },
            ]}
          >
            <Text style={styles.badgeIcon}>{STATUS_ICONS[task.status]}</Text>
            <Text
              style={[
                styles.statusBadgeText,
                { color: STATUS_COLORS[task.status] },
              ]}
            >
              {task.status}
            </Text>
          </View>
        </View>

        {/* Priority */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardLabel}>Priority</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: PRIORITY_COLORS[task.priority] + '22' },
            ]}
          >
            <Text style={styles.badgeIcon}>
              {PRIORITY_ICONS[task.priority]}
            </Text>
            <Text
              style={[
                styles.statusBadgeText,
                { color: PRIORITY_COLORS[task.priority] },
              ]}
            >
              {task.priority}
            </Text>
          </View>
        </View>
      </View>

      {/* Category */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>Category</Text>
        {category ? (
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: category.color + '22' },
            ]}
          >
            <View
              style={[styles.categoryDot, { backgroundColor: category.color }]}
            />
            <Text style={[styles.categoryText, { color: category.color }]}>
              {category.name}
            </Text>
          </View>
        ) : (
          <Text style={styles.noneText}>No category assigned</Text>
        )}
      </View>

      {/* Description */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>Description</Text>
        {task.description ? (
          <Text style={styles.descriptionText}>{task.description}</Text>
        ) : (
          <Text style={styles.noneText}>No description provided</Text>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
        >
          <Text style={styles.editBtnText}>✏️  Edit Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteBtn, deleting ? styles.btnDisabled : null]}
          onPress={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.deleteBtnText}>🗑️  Delete Task</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 60 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  loadingText: { color: '#6b7280', fontSize: 14 },
  errorEmoji: { fontSize: 48 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
  errorMessage: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  retryBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  retryBtnText: { color: '#fff', fontWeight: '600' },
  titleCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  dateText: { fontSize: 12, color: '#9ca3af' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    alignSelf: 'flex-start',
  },
  badgeIcon: { fontSize: 14 },
  statusBadgeText: { fontSize: 13, fontWeight: '700' },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    alignSelf: 'flex-start',
  },
  categoryDot: { width: 8, height: 8, borderRadius: 4 },
  categoryText: { fontSize: 14, fontWeight: '600' },
  noneText: { fontSize: 14, color: '#9ca3af', fontStyle: 'italic' },
  descriptionText: { fontSize: 15, color: '#374151', lineHeight: 24 },
  actions: { gap: 12, marginTop: 8 },
  editBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  deleteBtn: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnDisabled: { opacity: 0.6 },
});

export default TaskDetailScreen;