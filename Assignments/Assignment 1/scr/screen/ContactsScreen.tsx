import React from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

const contacts: Contact[] = [
  { id: '1', name: 'Academic Office', phone: '123-456-7890' },
  { id: '2', name: 'Student Affairs', phone: '123-456-7891' },
  { id: '3', name: 'Library', phone: '123-456-7892' },
  { id: '4', name: 'IT Support', phone: '123-456-7893' },
];

const ContactsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const renderContactCard = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={() => navigation.navigate('ContactDetails', { contact: item })}
    >
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={styles.contactPhone}>{item.phone}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Contacts</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={contacts}
          renderItem={renderContactCard}
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
    padding: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  contactPhone: {
    fontSize: 16,
    color: '#999',
  },
});

export default ContactsScreen;
