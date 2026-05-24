import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppContext } from '../store/AppContext';
import useForm from '../hooks/useForm';
import { validateTextField } from '../utils/validators';
import { createTask, updateTask, fetchTaskById } from '../api/tasksApi';
import { TaskStatus, TaskPriority } from '../store/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TaskForm'>;
  route: RouteProp<RootStackParamList, 'TaskForm'>;
};

type TaskFormValues = {
  title: string;
  description: string;
  status: string;
  priority: string;
  categoryId: string;
};

const STATUS_OPTIONS: TaskStatus[] = ['todo', 'in-progress', 'done'];
const PRIORITY_OPTIONS: TaskPriority[] = ['low', 'medium', 'high'];

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

const TaskFormScreen = ({ navigation, route }: Props) => {
  const { state, dispatch } = useAppContext();
  const taskId = route.params?.taskId;
  const isEditing = !!taskId;
  const [submitting, setSubmitting] = React.useState(false);
  const [loadingTask, setLoadingTask] = React.useState(false);

  const { values, errors, handleChange, validate, setValues } =
    useForm<TaskFormValues>(
      {
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        categoryId: '',
      },
      {
        title: (v) => validateTextField(v, 'Title', 2, 100),
        description: (v) =>
          v.trim().length > 0
            ? validateTextField(v, 'Description', 0, 500)
            : null,
      }
    );

  // If editing, pre-fill the form with existing task data
  useEffect(() => {
    if (!isEditing) return;

    const loadTask = async () => {
      setLoadingTask(true);
      try {
        const task = await fetchTaskById(taskId);
        setValues({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          categoryId: task.categoryId,
        });
      } catch (error) {
        Alert.alert(
          'Error',
          error instanceof Error ? error.message : 'Failed to load task.'
        );
        navigation.goBack();
      } finally {
        setLoadingTask(false);
      }
    };

    loadTask();
  }, [taskId]);

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEditing) {
        // Update existing task
        const updated = await updateTask(taskId, {
          title: values.title,
          description: values.description,
          status: values.status as TaskStatus,
          priority: values.priority as TaskPriority,
          categoryId: values.categoryId,
        });
        dispatch({ type: 'UPDATE_TASK', payload: updated });
        Alert.alert('Success', 'Task updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        // Create new task
        const created = await createTask({
          title: values.title,
          description: values.description,
          status: values.status as TaskStatus,
          priority: values.priority as TaskPriority,
          categoryId: values.categoryId,
        });
        dispatch({ type: 'ADD_TASK', payload: created });
        Alert.alert('Success', 'Task created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to save task.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading spinner while fetching task for edit
  if (loadingTask) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading task...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Title field */}
      <Text style={styles.label}>
        Title <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.title ? styles.inputError : null]}
        placeholder="Enter task title"
        placeholderTextColor="#9ca3af"
        value={values.title}
        onChangeText={(v) => handleChange('title', v)}
        maxLength={100}
      />
      {errors.title ? (
        <Text style={styles.errorText}>{errors.title}</Text>
      ) : null}

      {/* Description field */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[
          styles.input,
          styles.textArea,
          errors.description ? styles.inputError : null,
        ]}
        placeholder="Enter task description (optional)"
        placeholderTextColor="#9ca3af"
        value={values.description}
        onChangeText={(v) => handleChange('description', v)}
        multiline
        numberOfLines={4}
        maxLength={500}
        textAlignVertical="top"
      />
      {errors.description ? (
        <Text style={styles.errorText}>{errors.description}</Text>
      ) : null}

      {/* Status selector */}
      <Text style={styles.label}>
        Status <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.optionRow}>
        {STATUS_OPTIONS.map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.optionBtn,
              values.status === s
                ? { backgroundColor: STATUS_COLORS[s] }
                : { borderColor: STATUS_COLORS[s], borderWidth: 1.5 },
            ]}
            onPress={() => handleChange('status', s)}
          >
            <Text
              style={[
                styles.optionText,
                { color: values.status === s ? '#fff' : STATUS_COLORS[s] },
              ]}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Priority selector */}
      <Text style={styles.label}>
        Priority <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.optionRow}>
        {PRIORITY_OPTIONS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.optionBtn,
              values.priority === p
                ? { backgroundColor: PRIORITY_COLORS[p] }
                : { borderColor: PRIORITY_COLORS[p], borderWidth: 1.5 },
            ]}
            onPress={() => handleChange('priority', p)}
          >
            <Text
              style={[
                styles.optionText,
                { color: values.priority === p ? '#fff' : PRIORITY_COLORS[p] },
              ]}
            >
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category selector */}
      <Text style={styles.label}>Category</Text>
      {state.categories.length === 0 ? (
        <TouchableOpacity
          style={styles.noCategoryBtn}
          onPress={() => navigation.navigate('Categories')}
        >
          <Text style={styles.noCategoryText}>
            ＋ Create a category first
          </Text>
        </TouchableOpacity>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {/* No category option */}
          <TouchableOpacity
            style={[
              styles.categoryChip,
              values.categoryId === ''
                ? styles.categoryChipActive
                : null,
            ]}
            onPress={() => handleChange('categoryId', '')}
          >
            <Text
              style={[
                styles.categoryChipText,
                values.categoryId === ''
                  ? styles.categoryChipTextActive
                  : null,
              ]}
            >
              None
            </Text>
          </TouchableOpacity>

          {state.categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                values.categoryId === cat.id
                  ? { backgroundColor: cat.color }
                  : { borderColor: cat.color, borderWidth: 1.5 },
              ]}
              onPress={() => handleChange('categoryId', cat.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  {
                    color:
                      values.categoryId === cat.id ? '#fff' : cat.color,
                  },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Submit button */}
      <TouchableOpacity
        style={[styles.submitBtn, submitting ? styles.submitBtnDisabled : null]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>
            {isEditing ? '💾 Save Changes' : '✅ Create Task'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Cancel button */}
      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => navigation.goBack()}
        disabled={submitting}
      >
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  contentContainer: { padding: 20, paddingBottom: 60 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: { color: '#6b7280', fontSize: 14 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  required: { color: '#ef4444' },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#fff',
  },
  textArea: { height: 100, paddingTop: 12 },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  optionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  optionText: { fontSize: 13, fontWeight: '600' },
  categoryScroll: { marginBottom: 4 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  categoryChipActive: { backgroundColor: '#6366f1' },
  categoryChipText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  categoryChipTextActive: { color: '#fff' },
  noCategoryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#eef2ff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  noCategoryText: { color: '#6366f1', fontWeight: '600', fontSize: 13 },
  submitBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelBtnText: { color: '#6b7280', fontSize: 15, fontWeight: '600' },
});

export default TaskFormScreen;