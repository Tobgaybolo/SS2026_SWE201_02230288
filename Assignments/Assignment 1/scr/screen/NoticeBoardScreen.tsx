import React from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet } from 'react-native';

interface Notice {
  id: string;
  date: string;
  title: string;
  description: string;
}

const noticesData: Notice[] = [
  {
    id: '1',
    date: 'April 12, 2026',
    title: 'Semester Exam Schedule Released',
    description: 'The examination schedule for the summer semester has been released. Please check the portal for your examination dates and timings.',
  },
  {
    id: '2',
    date: 'April 10, 2026',
    title: 'Library Extended Hours',
    description: 'The library will have extended hours during exam season. Open until 10 PM from Monday to Saturday.',
  },
  {
    id: '3',
    date: 'April 8, 2026',
    title: 'Sports Day Registration Open',
    description: 'Annual sports day will be held on April 25th. Registration is now open for all students. Limited slots available.',
  },
  {
    id: '4',
    date: 'April 5, 2026',
    title: 'Maintenance Notice',
    description: 'The campus WIFI will be unavailable on April 7th from 10 PM - 6 AM for scheduled maintenance.',
  },
  {
    id: '5',
    date: 'April 1, 2026',
    title: 'New Scholarship Opportunities',
    description: 'Several scholarship programs are now open for applications. Students with GPA above 3.5 are eligible to apply.',
  },
];

const NoticeBoardScreen: React.FC = () => {
  const renderNoticeCard = ({ item }: { item: Notice }) => (
    <View style={styles.noticeCard}>
      <Text style={styles.noticeDate}>{item.date}</Text>
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text style={styles.noticeDescription}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Notice Board</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={noticesData}
          renderItem={renderNoticeCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
        />
      </View>
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
  listContainer: {
    flex: 1,
    padding: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  noticeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#2b8a9e',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noticeDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noticeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default NoticeBoardScreen;
