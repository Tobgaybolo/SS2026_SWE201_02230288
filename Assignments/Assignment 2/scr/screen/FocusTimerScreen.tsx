import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Task {
  id: string;
  title: string;
  category: string;
  color: string;
  icon: string;
}

interface TimerState {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

export default function FocusTimerScreen({ route, navigation }: any) {
  const task: Task | undefined = route?.params?.task;

  const [timerState, setTimerState] = useState<TimerState>({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  });

  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [running, setRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timerState.focusDuration * 60);
  const [sessions, setSessions] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [inputValue, setInputValue] = useState('');

  const progress = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<any>(null);

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⏱️</Text>
          <Text style={styles.emptyTitle}>No Task Selected</Text>
          <Text style={styles.emptyMessage}>
            Go to Home and tap "Start a session" to select a task and begin focusing
          </Text>
          <Pressable 
            style={styles.selectTaskButton}
            onPress={() => navigation.navigate('HomeTabs', { screen: 'Home' })}
          >
            <Text style={styles.selectTaskButtonText}>← Back to Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const getModeDuration = () => {
    switch (mode) {
      case 'focus':
        return timerState.focusDuration * 60;
      case 'shortBreak':
        return timerState.shortBreakDuration * 60;
      case 'longBreak':
        return timerState.longBreakDuration * 60;
      default:
        return timerState.focusDuration * 60;
    }
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    const totalDuration = getModeDuration();
    const elapsed = totalDuration - timeRemaining;
    const progressValue = Math.min(elapsed / totalDuration, 1);

    Animated.timing(progress, {
      toValue: progressValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [timeRemaining]);

  const handleTimerEnd = () => {
    setRunning(false);
    if (mode === 'focus') {
      setSessions((s) => s + 1);
      Alert.alert('Focus session complete!', 'Great work! Time for a break.');
    } else {
      Alert.alert('Break complete!', 'Ready to focus again?');
    }
  };

  const startTimer = () => {
    setRunning(true);
    progress.setValue(0);
  };

  const stopTimer = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setTimeRemaining(getModeDuration());
    progress.setValue(0);
  };

  const switchMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    stopTimer();
    setMode(newMode);
    setTimeRemaining(
      newMode === 'focus'
        ? timerState.focusDuration * 60
        : newMode === 'shortBreak'
        ? timerState.shortBreakDuration * 60
        : timerState.longBreakDuration * 60
    );
    progress.setValue(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openTimerModal = (type: 'focus' | 'short' | 'long') => {
    setModalMode(type);
    const current =
      type === 'focus'
        ? timerState.focusDuration
        : type === 'short'
        ? timerState.shortBreakDuration
        : timerState.longBreakDuration;
    setInputValue(current.toString());
    setShowModal(true);
  };

  const saveTimerDuration = () => {
    const value = parseInt(inputValue, 10);

    if (isNaN(value) || value < 1) {
      Alert.alert('Invalid input', 'Please enter a valid number');
      return;
    }

    if (modalMode === 'short' && value > 10) {
      Alert.alert('Invalid duration', 'Short break cannot exceed 10 minutes');
      return;
    }

    if (modalMode === 'long' && value > 30) {
      Alert.alert('Invalid duration', 'Long break cannot exceed 30 minutes');
      return;
    }

    const updatedState = { ...timerState };
    if (modalMode === 'focus') updatedState.focusDuration = value;
    else if (modalMode === 'short') updatedState.shortBreakDuration = value;
    else updatedState.longBreakDuration = value;

    setTimerState(updatedState);

    // Update current timer if already in that mode
    if (
      (mode === 'focus' && modalMode === 'focus') ||
      (mode === 'shortBreak' && modalMode === 'short') ||
      (mode === 'longBreak' && modalMode === 'long')
    ) {
      setTimeRemaining(value * 60);
      progress.setValue(0);
    }

    setShowModal(false);
  };

  const interpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getModeColor = () => {
    switch (mode) {
      case 'focus':
        return '#7f77dd';
      case 'shortBreak':
        return '#10b981';
      case 'longBreak':
        return '#3b82f6';
      default:
        return '#7f77dd';
    }
  };

  const getModeName = () => {
    switch (mode) {
      case 'focus':
        return 'Focus';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Focus';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Task Header */}
        <View
          style={[styles.header, { backgroundColor: task.color || '#7c5cff' }]}
        >
          <View style={styles.taskInfo}>
            <Text style={styles.taskIcon}>{task.icon}</Text>
            <View style={styles.taskTextContent}>
              <Text style={styles.modeLabel}>{getModeName()} mode</Text>
              <Text style={styles.taskTitle}>{task.title}</Text>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          {/* Timer Ring */}
          <View style={styles.ringContainer}>
            <View style={styles.ringBackground} />
            <Animated.View
              style={[
                styles.ringProgress,
                {
                  transform: [{ rotate: interpolated }],
                  borderColor: getModeColor(),
                },
              ]}
            />
            <View style={styles.ringCenter}>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
              <Text style={styles.remainingLabel}>remaining</Text>
            </View>
          </View>

          {/* Mode Buttons */}
          <View style={styles.modeButtonsContainer}>
            <Pressable
              style={[
                styles.modeButton,
                mode === 'focus' && styles.modeButtonActive,
                { borderColor: mode === 'focus' ? '#7f77dd' : '#e6eef8' },
              ]}
              onPress={() => switchMode('focus')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'focus' && styles.modeButtonTextActive,
                ]}
              >
                Focus
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                mode === 'shortBreak' && styles.modeButtonActive,
                { borderColor: mode === 'shortBreak' ? '#10b981' : '#e6eef8' },
              ]}
              onPress={() => switchMode('shortBreak')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'shortBreak' && styles.modeButtonTextActive,
                ]}
              >
                Short break
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                mode === 'longBreak' && styles.modeButtonActive,
                { borderColor: mode === 'longBreak' ? '#3b82f6' : '#e6eef8' },
              ]}
              onPress={() => switchMode('longBreak')}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  mode === 'longBreak' && styles.modeButtonTextActive,
                ]}
              >
                Long break
              </Text>
            </Pressable>
          </View>

          {/* Timer Settings */}
          <View style={styles.settingsContainer}>
            <Text style={styles.settingsTitle}>Timer Settings</Text>

            {/* Focus Duration */}
            <Pressable
              style={styles.settingCard}
              onPress={() => openTimerModal('focus')}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Focus Duration</Text>
                <Text style={styles.settingValue}>
                  {timerState.focusDuration} min
                </Text>
              </View>
              <Text style={styles.settingEdit}>✏️</Text>
            </Pressable>

            {/* Short Break Duration */}
            <Pressable
              style={styles.settingCard}
              onPress={() => openTimerModal('short')}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Short Break (Max 10 min)</Text>
                <Text style={styles.settingValue}>
                  {timerState.shortBreakDuration} min
                </Text>
              </View>
              <Text style={styles.settingEdit}>✏️</Text>
            </Pressable>

            {/* Long Break Duration */}
            <Pressable
              style={styles.settingCard}
              onPress={() => openTimerModal('long')}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Long Break (Max 30 min)</Text>
                <Text style={styles.settingValue}>
                  {timerState.longBreakDuration} min
                </Text>
              </View>
              <Text style={styles.settingEdit}>✏️</Text>
            </Pressable>
          </View>

          {/* Control Buttons */}
          <View style={styles.controlsContainer}>
            <View style={styles.mainControls}>
              {!running ? (
                <Pressable
                  style={[styles.controlButton, styles.startButton]}
                  onPress={startTimer}
                >
                  <Text style={styles.playIcon}>▶</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.controlButton, styles.stopButton]}
                  onPress={stopTimer}
                >
                  <Text style={styles.pauseIcon}>⏸</Text>
                </Pressable>
              )}

              <Pressable
                style={[styles.controlButton, styles.resetButton]}
                onPress={resetTimer}
              >
                <Text style={styles.resetIcon}>↻</Text>
              </Pressable>

              <Pressable
                style={[styles.controlButton, styles.stopButton]}
                onPress={() => navigation.navigate('HomeTabs')}
              >
                <Text style={styles.stopIcon}>⏹</Text>
              </Pressable>
            </View>
          </View>

          {/* Sessions Counter */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsLabel}>Sessions Completed</Text>
            <Text style={styles.statsValue}>{sessions}</Text>
          </View>
        </View>

        {/* Timer Duration Modal */}
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Set Duration</Text>

              <Text style={styles.modalLabel}>
                {modalMode === 'focus'
                  ? 'Focus Duration (minutes)'
                  : modalMode === 'short'
                  ? 'Short Break Duration (Max 10 min)'
                  : 'Long Break Duration (Max 30 min)'}
              </Text>

              <TextInput
                style={styles.modalInput}
                keyboardType="number-pad"
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Enter minutes"
              />

              <View style={styles.modalButtonsContainer}>
                <Pressable
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={saveTimerDuration}
                >
                  <Text style={styles.modalSaveText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  selectTaskButton: {
    backgroundColor: '#7c5cff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  selectTaskButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 18,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIcon: {
    fontSize: 36,
    marginRight: 12,
  },
  taskTextContent: {
    flex: 1,
  },
  modeLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  container: {
    padding: 18,
  },
  ringContainer: {
    width: 240,
    height: 240,
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringBackground: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 12,
    borderColor: '#e6eef8',
  },
  ringProgress: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 12,
    borderColor: '#7f77dd',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  ringCenter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1f2937',
  },
  remainingLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  modeButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e6eef8',
  },
  modeButtonActive: {
    backgroundColor: 'rgba(127, 119, 221, 0.1)',
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  modeButtonTextActive: {
    color: '#7f77dd',
  },
  settingsContainer: {
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  settingEdit: {
    fontSize: 18,
    marginLeft: 12,
  },
  controlsContainer: {
    marginBottom: 24,
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#7f77dd',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  resetButton: {
    backgroundColor: '#f97316',
  },
  playIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  pauseIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  resetIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  stopIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  statsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  statsLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#7f77dd',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#e6eef8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f3f4f6',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  modalSaveButton: {
    backgroundColor: '#7f77dd',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
