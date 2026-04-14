import React from "react";
import { SafeAreaView, Text, View, StyleSheet } from "react-native";

type Contact = {
  id: string;
  name: string;
  phone: string;
};

type ContactDetailsProps = {
  route: {
    params?: {
      contact?: Contact;
    };
  };
};

function ContactDetailsScreen({ route }: ContactDetailsProps) {
  const contact = route?.params?.contact;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Department</Text>
        <Text style={styles.value}>{contact?.name ?? "Unknown"}</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{contact?.phone ?? "N/A"}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
  },
});

export default ContactDetailsScreen;
