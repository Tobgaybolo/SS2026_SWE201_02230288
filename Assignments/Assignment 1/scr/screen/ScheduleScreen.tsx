import React, { useMemo } from 'react';
import { View, Text, SafeAreaView, StyleSheet, SectionList } from 'react-native';

type ScheduleItem = {
  id: string;
  day: string;
  time: string;
  course: string;
  location: string;
};

const weeklySchedule: ScheduleItem[] = [
  { id: '1', day: 'Mon', time: '09:00 - 10:00', course: 'CTE205', location: 'ClassRoom 106' },
  { id: '2', day: 'Mon', time: '10:15 - 11:15', course: 'DSO101', location: 'ClassRoom 106' },
  { id: '3', day: 'Tue', time: '11:15 - 12:15', course: 'DIS303', location: 'IT-Lab 1' },
  { id: '4', day: 'Wed', time: '01:15 - 02:15', course: 'SDA202', location: 'ClassRoom 106' },
  { id: '5', day: 'Thu', time: '02:15 - 03:15', course: 'DIS303', location: 'IT-Lab 1' },
  { id: '6', day: 'Fri', time: '03:15 - 04:15', course: 'Software Engineering', location: 'ClassRoom 106' },
];

const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

type ScheduleSection = {
  title: string;
  data: ScheduleItem[];
};

function getStartMinutes(timeRange: string) {
  const startTime = timeRange.split(' - ')[0];
  const [hours, minutes] = startTime.split(':').map(Number);
  return hours * 60 + minutes;
}

const ScheduleScreen: React.FC = () => {
  const todayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDay = todayMap[new Date().getDay()];

  const sections = useMemo<ScheduleSection[]>(
    () =>
      dayOrder.map((day) => ({
        title: day,
        data: weeklySchedule
          .filter((item) => item.day === day)
          .sort((first, second) => getStartMinutes(first.time) - getStartMinutes(second.time)),
      })),
    []
  );

  const renderScheduleItem = ({ item }: { item: ScheduleItem }) => (
    <View style={styles.scheduleCard}>
      <View style={styles.timeHeader}>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.courseName}>{item.course}</Text>
        <Text style={styles.courseLocation}>{item.location}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Schedule</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderScheduleItem}
        renderSectionHeader={({ section }) => {
          const isToday = section.title === currentDay;
          return (
            <View style={isToday ? styles.sectionHeaderToday : styles.sectionHeader}>
              <Text style={isToday ? styles.sectionHeaderTextToday : styles.sectionHeaderText}>
                {section.title}
              </Text>
            </View>
          );
        }}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<View style={styles.footerSpacer} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#2b8a9e',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#d6e7eb',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    marginTop: 8,
  },
  sectionHeaderToday: {
    backgroundColor: '#2b8a9e',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    marginTop: 8,
  },
  sectionHeaderText: {
    color: '#2b8a9e',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionHeaderTextToday: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  scheduleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  timeHeader: {
    backgroundColor: '#2b8a9e',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  cardContent: {
    padding: 20,
  },
  courseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  courseLocation: {
    fontSize: 16,
    color: '#999',
  },
  footerSpacer: {
    height: 8,
  },
});

export default ScheduleScreen;
