import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailScreen({ route, navigation }: any) {
  const { category } = route.params || {};
  const [expandedSubtask, setExpandedSubtask] = useState<any>(null);

  const initialSubtasks = [
    { id: '1', title: 'Plan app screens & navigation', completed: true },
    { id: '2', title: 'Set up React Navigation', completed: true },
    { id: '3', title: 'Build all 5 screens', completed: true },
    { id: '4', title: 'Add animations & gestures', completed: false },
    { id: '5', title: 'Write report & submit', completed: false },
  ];

  const [subtasks, setSubtasks] = useState(initialSubtasks);
  const scalesRef = useRef<Record<string, Animated.Value>>({});
  initialSubtasks.forEach((s) => {
    if (!scalesRef.current[s.id]) scalesRef.current[s.id] = new Animated.Value(1);
  });

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      return next;
    });

    const scale = scalesRef.current[id];
    if (scale) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.15, duration: 120, useNativeDriver: false }),
        Animated.spring(scale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: false }),
      ]).start();
    }
  };

  const completedCount = subtasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / subtasks.length) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.headerSubtitle}>{category?.name || 'SWE 201'}</Text>
          </View>
          <Text style={styles.headerTitle}>SWE201 Assignment 2</Text>
          
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>High priority</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Due tonight</Text>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          {/* Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercent}>{completedCount}/5 subtasks</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
          </View>

          {/* Subtasks */}
          <Text style={styles.sectionTitle}>Subtasks</Text>
          {subtasks.map((subtask) => (
            <Pressable
              key={subtask.id}
              style={[styles.subtaskItem, subtask.completed && styles.subtaskCompleted]}
              onPress={() => toggleSubtask(subtask.id)}
            >
              <View style={styles.checkboxWrapper}>
                <Animated.View
                  style={[
                    styles.checkbox,
                    subtask.completed && styles.checkboxCompleted,
                    { transform: [{ scale: scalesRef.current[subtask.id] || 1 }] },
                  ]}
                >
                  {subtask.completed && <Text style={styles.checkmark}>✓</Text>}
                </Animated.View>
              </View>
              <Animated.Text
                style={[
                  styles.subtaskText,
                  subtask.completed && styles.subtaskCompletedText,
                  { transform: [{ scale: scalesRef.current[subtask.id] || 1 }] },
                ]}
              >
                {subtask.title}
              </Animated.Text>
            </Pressable>
          ))}

          {/* Notes */}
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>
              Must include Animated API + gesture handler. No backend needed.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#7c5cff',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 18,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backIcon: {
    fontSize: 28,
    color: '#ffffff',
    marginRight: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  container: {
    padding: 18,
  },
  progressCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c5cff',
  },
  progressPercent: {
    fontSize: 14,
    color: '#9ca3af',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e6eef8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7c5cff',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7c5cff',
    marginBottom: 12,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  subtaskCompleted: {
    backgroundColor: 'rgba(124, 92, 255, 0.05)',
  },
  checkboxWrapper: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#7c5cff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#7c5cff',
    borderColor: '#7c5cff',
  },
  checkmark: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  subtaskText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
  },
  subtaskCompletedText: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  notesCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
});

