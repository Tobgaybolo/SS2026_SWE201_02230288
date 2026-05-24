import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppContext } from '../store/AppContext';
import useFetchTasks from '../hooks/useFetchTasks';
import useAuth from '../hooks/useAuth';
import { deleteTask } from '../api/tasksApi';
import { Task } from '../store/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TaskList'>;
};

// Color maps for status and priority badges
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

const STATUS_OPTIONS = ['all', 'todo', 'in-progress', 'done'];

const TaskListScreen = ({ navigation }: Props) => {
  const { state, dispatch } = useAppContext();
  const { logout } = useAuth();
  const { retry } = useFetchTasks();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    retry();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Filter + search logic
  const filteredTasks = state.tasks.filter((task) => {
    const matchesStatus =
      !state.filters.status || state.filters.status === 'all'
        ? true
        : task.status === state.filters.status;

    const matchesSearch = state.filters.searchQuery
      ? task.title
          .toLowerCase()
          .includes(state.filters.searchQuery.toLowerCase())
      : true;

    return matchesStatus && matchesSearch;
  });

  // Delete with confirmation
  const handleDelete = (task: Task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(task.id);
            try {
              await deleteTask(task.id);
              dispatch({ type: 'DELETE_TASK', payload: task.id });
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Failed to delete task.'
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  // Get category name by id
  const getCategoryName = (categoryId: string): string => {
    const cat = state.categories.find((c) => c.id === categoryId);
    return cat ? cat.name : 'Uncategorized';
  };

  const getCategoryColor = (categoryId: string): string => {
    const cat = state.categories.find((c) => c.id === categoryId);
    return cat ? cat.color : '#9ca3af';
  };

  // Render each task card
  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
      activeOpacity={0.85}
    >
      {/* Card header — title + priority badge */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: PRIORITY_COLORS[item.priority] + '22' },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: PRIORITY_COLORS[item.priority] },
            ]}
          >
            {item.priority}
          </Text>
        </View>
      </View>

      {/* Description preview */}
      {item.description ? (
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      {/* Card footer — status + category + actions */}
      <View style={styles.cardFooter}>
        <View style={styles.cardTags}>
          {/* Status badge */}
          <View
            style={[
              styles.badge,
              { backgroundColor: STATUS_COLORS[item.status] + '22' },
            ]}
          >
            <Text
              style={[styles.badgeText, { color: STATUS_COLORS[item.status] }]}
            >
              {item.status}
            </Text>
          </View>

          {/* Category badge */}
          <View
            style={[
              styles.badge,
              { backgroundColor: getCategoryColor(item.categoryId) + '22' },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getCategoryColor(item.categoryId) },
              ]}
            >
              {getCategoryName(item.categoryId)}
            </Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate('TaskForm', { taskId: item.id })
            }
          >
            <Text style={styles.editBtnText}>✏️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDelete(item)}
            disabled={deletingId === item.id}
          >
            {deletingId === item.id ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <Text style={styles.deleteBtnText}>🗑️</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📭</Text>
      <Text style={styles.emptyTitle}>No tasks found</Text>
      <Text style={styles.emptySubtitle}>
        {state.filters.searchQuery || state.filters.status !== 'all'
          ? 'Try adjusting your filters'
          : 'Tap + to create your first task'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top bar — search + logout */}
      <View style={styles.topBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search tasks..."
          placeholderTextColor="#9ca3af"
          value={state.filters.searchQuery}
          onChangeText={(v) =>
            dispatch({ type: 'SET_FILTER', payload: { searchQuery: v } })
          }
        />
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>👋</Text>
        </TouchableOpacity>
      </View>

      {/* Status filter tabs */}
      <View style={styles.filterRow}>
        {STATUS_OPTIONS.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterTab,
              state.filters.status === status || 
              (!state.filters.status && status === 'all')
                ? styles.filterTabActive
                : null,
            ]}
            onPress={() =>
              dispatch({ type: 'SET_FILTER', payload: { status } })
            }
          >
            <Text
              style={[
                styles.filterTabText,
                state.filters.status === status ||
                (!state.filters.status && status === 'all')
                  ? styles.filterTabTextActive
                  : null,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categories shortcut */}
      <TouchableOpacity
        style={styles.categoriesBtn}
        onPress={() => navigation.navigate('Categories')}
      >
        <Text style={styles.categoriesBtnText}>🏷️ Manage Categories</Text>
      </TouchableOpacity>

      {/* Error state */}
      {state.error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>⚠️ {state.error}</Text>
          <TouchableOpacity onPress={retry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Loading state */}
      {state.loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            filteredTasks.length === 0 ? styles.flatListEmpty : styles.flatList
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#6366f1']}
              tintColor="#6366f1"
            />
          }
        />
      )}

      {/* Floating Add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('TaskForm', {})}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  logoutBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 42,
    height: 42,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
  },
  logoutText: { fontSize: 20 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterTabActive: { backgroundColor: '#6366f1' },
  filterTabText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  filterTabTextActive: { color: '#fff' },
  categoriesBtn: {
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#eef2ff',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  categoriesBtnText: { color: '#6366f1', fontWeight: '600', fontSize: 13 },
  errorBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
  },
  errorBannerText: { color: '#dc2626', fontSize: 13, flex: 1 },
  retryText: { color: '#6366f1', fontWeight: 'bold', fontSize: 13 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: { color: '#6b7280', fontSize: 14 },
  flatList: { padding: 16, gap: 12, paddingBottom: 100 },
  flatListEmpty: { flex: 1 },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  cardDesc: { fontSize: 13, color: '#6b7280', marginBottom: 10 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cardTags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', flex: 1 },
  cardActions: { flexDirection: 'row', gap: 8 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtnText: { fontSize: 16 },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: { fontSize: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 30, fontWeight: '300', marginTop: -2 },
});

export default TaskListScreen;