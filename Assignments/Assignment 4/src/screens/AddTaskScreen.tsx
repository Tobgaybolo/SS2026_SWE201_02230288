import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task, RepeatMode } from '../types';
import { useTasks } from '../context/TaskContext';

export default function AddTaskScreen({ navigation }: any) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repeat, setRepeat] = useState<RepeatMode>('none');

  const [date, setDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now;
  });

  // iOS shows the picker inline; Android shows it on demand.
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a task title.');
      return;
    }
    // For one-off reminders the time must be in the future. Daily reminders
    // can use any time of day.
    if (repeat === 'none' && date.getTime() <= Date.now()) {
      Alert.alert('Invalid time', 'Please pick a future date and time.');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      dueDate: date,
      repeat,
      reminderEnabled: false,
    };

    addTask(newTask);
    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={{ padding: 6 }}>
          <Text style={{ color: '#4630EB', fontSize: 16, fontWeight: 'bold' }}>Save</Text>
        </TouchableOpacity>
      ),
    });
    // Re-bind handleSave when inputs change so it captures current values.
  }, [navigation, title, description, date, repeat]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Submit assignment"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Optional details"
        multiline
      />

      <Text style={styles.label}>Due Date & Time</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>{date.toLocaleString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowPicker(Platform.OS === 'ios');
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Frequency</Text>
      <View style={styles.row}>
        {(['none', 'daily'] as RepeatMode[]).map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[styles.chip, repeat === mode && styles.chipActive]}
            onPress={() => setRepeat(mode)}
          >
            <Text style={[styles.chipText, repeat === mode && styles.chipTextActive]}>
              {mode === 'none' ? 'One time' : 'Daily'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16 },
  dateButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15 },
  dateText: { fontSize: 16 },
  row: { flexDirection: 'row', gap: 10 },
  chip: {
    borderWidth: 1,
    borderColor: '#4630EB',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  chipActive: { backgroundColor: '#4630EB' },
  chipText: { color: '#4630EB', fontWeight: '600' },
  chipTextActive: { color: 'white' },
});
