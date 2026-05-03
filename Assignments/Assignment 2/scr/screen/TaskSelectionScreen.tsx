import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TaskSelectionScreen({ navigation }: any) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [fade]);

  const availableTasks = [
    {
      id: '1',
      title: 'Read Chapter 4 — OS',
      category: 'CS',
      color: '#7c3aed',
      icon: '📖',
    },
    {
      id: '2',
      title: 'SWE201 Assignment 2',
      category: 'SWE',
      color: '#3b82f6',
      icon: '💻',
    },
    {
      id: '3',
      title: 'Linear Algebra problem set',
      category: 'MATH',
      color: '#dc2626',
      icon: '📐',
    },
    {
      id: '4',
      title: 'Review Data Structures',
      category: 'CS',
      color: '#7c3aed',
      icon: '🔍',
    },
    {
      id: '5',
      title: 'Project planning session',
      category: 'SWE',
      color: '#3b82f6',
      icon: '📋',
    },
  ];

  const handleTaskSelect = (task: any) => {
    navigation.navigate('Focus', { task });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fade }]}>
          <Text style={styles.title}>Select a Task</Text>
          <Text style={styles.subtitle}>Choose what you want to focus on</Text>
        </Animated.View>

        <View style={styles.container}>
          {/* Tasks Grid */}
          <Animated.View style={{ opacity: fade }}>
            {availableTasks.map((task, index) => (
              <Pressable
                key={task.id}
                style={[styles.taskCard, { borderLeftColor: task.color }]}
                onPress={() => handleTaskSelect(task)}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{task.icon}</Text>
                  </View>
                  <View style={styles.textContent}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={styles.category}>{task.category}</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </View>
              </Pressable>
            ))}
          </Animated.View>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  container: {
    padding: 18,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  textContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: '#9ca3af',
  },
  arrow: {
    fontSize: 20,
    color: '#d1d5db',
  },
});
