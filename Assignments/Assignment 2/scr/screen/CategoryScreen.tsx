import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState('All');

  const subjects = [
    { id: '1', name: 'SWE 201', icon: '💻', tasks: 3, color: '#7c5cff', progress: 0.6 },
    { id: '2', name: 'MATH 301', icon: '📐', tasks: 4, color: '#10b981', progress: 0.5 },
    { id: '3', name: 'CS 302', icon: '🖥️', tasks: 2, color: '#f97316', progress: 0.75 },
    { id: '4', name: 'ENG 201', icon: '📚', tasks: 3, color: '#3b82f6', progress: 0.4 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Subjects</Text>
          <Text style={styles.subtitle}>6 subjects • 11 tasks pending</Text>
        </View>

        <View style={styles.container}>
          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filter</Text>
            <View style={styles.filterButtons}>
              {['All', 'In progress', 'Done'].map((filter) => (
                <Pressable
                  key={filter}
                  style={[
                    styles.filterButton,
                    activeFilter === filter && styles.filterButtonActive,
                  ]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      activeFilter === filter && styles.filterButtonTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Subjects Grid */}
          <Text style={styles.sectionTitle}>Subjects</Text>
          <View style={styles.grid}>
            {subjects.map((subject) => (
              <Pressable
                key={subject.id}
                style={[styles.subjectCard, { borderLeftColor: subject.color }]}
                onPress={() => navigation.navigate('Detail', { category: subject })}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.icon}>{subject.icon}</Text>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                </View>
                <Text style={styles.taskCount}>{subject.tasks} tasks</Text>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${subject.progress * 100}%`,
                          backgroundColor: subject.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              </Pressable>
            ))}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  container: {
    padding: 18,
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7c5cff',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  filterButtonActive: {
    backgroundColor: '#7c5cff',
    borderColor: '#7c5cff',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7c5cff',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  taskCount: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e6eef8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

