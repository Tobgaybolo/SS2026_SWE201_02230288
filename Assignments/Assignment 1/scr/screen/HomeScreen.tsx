import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';

type Program = {
  id: string;
  title: string;
  subtitle: string;
};

const programs: Program[] = [
  { id: '1', title: 'BE (Civil)', subtitle: 'Civil Engineering' },
  { id: '2', title: 'BE (Electrical)', subtitle: 'Electrical Engineering' },
  { id: '3', title: 'BE (ECE)', subtitle: 'Electronics & Communication Engineering' },
  { id: '4', title: 'BE (IT)', subtitle: 'Information Technology Program' },
  { id: '5', title: 'B (Architecture)', subtitle: 'Architecture Program' },
  { id: '6', title: 'BE (Engineering Geology)', subtitle: 'Engineering Geology Program' },
  { id: '7', title: 'BE (ICE)', subtitle: 'Instrumentation & Control Engineering' },
  { id: '8', title: 'BE (Water Resources)', subtitle: 'Water Resources Engineering' },
  { id: '9', title: 'BE (Mechanical)', subtitle: 'Mechanical Engineering' },
  { id: '10', title: 'BE (Software)', subtitle: 'Software Engineering' },
];

const logoImage = require('../../images/Logo.png');

const HomeScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const screenWidth = Dimensions.get('window').width;
  const styles = useMemo(() => createStyles(screenWidth), [screenWidth]);

  const filteredPrograms = programs.filter((item) => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) {
      return true;
    }

    return (
      item.title.toLowerCase().includes(keyword) ||
      item.subtitle.toLowerCase().includes(keyword)
    );
  });

  const renderProgramCard = ({ item }: { item: Program }) => (
    <TouchableOpacity style={styles.programCard}>
      <Text style={styles.programTitle}>{item.title}</Text>
      <Text style={styles.programSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Campus Companion</Text>
      </View>

      <View style={styles.collegeInfoContainer}>
        <View style={styles.collegeTextContainer}>
          <Text style={styles.collegeName}>COLLEGE OF SCIENCE AND TECHNOLOGY</Text>
        </View>
        <View style={styles.logoPlaceholder}>
          <Image source={logoImage} style={styles.logoImage} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.gridContainer}>
        <FlatList
          data={filteredPrograms}
          renderItem={renderProgramCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={true}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

function createStyles(screenWidth: number) {
  const horizontalPadding = 20;
  const columnGap = 16;
  const cardWidth = (screenWidth - horizontalPadding - columnGap) / 2;

  return StyleSheet.create({
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
      marginBottom: 15,
    },
    collegeInfoContainer: {
      backgroundColor: 'white',
      padding: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    collegeTextContainer: {
      flex: 1,
    },
    collegeName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
    },
    logoPlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    logoImage: {
      width: 60,
      height: 60,
    },
    searchContainer: {
      padding: 15,
      backgroundColor: 'white',
    },
    searchInput: {
      backgroundColor: '#f0f0f0',
      borderRadius: 25,
      paddingVertical: 12,
      paddingHorizontal: 20,
      fontSize: 16,
      color: '#666',
    },
    gridContainer: {
      flex: 1,
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    gridRow: {
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    listContent: {
      paddingBottom: 20,
    },
    programCard: {
      width: cardWidth,
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    programTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: 8,
    },
    programSubtitle: {
      fontSize: 12,
      color: '#999',
      textAlign: 'center',
    },
  });
}

export default HomeScreen;
