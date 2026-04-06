import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationTypes";

type Props = NativeStackScreenProps<RootStackParamList, "ContactDetails">;

function ContactDetailsScreen({ route }: Props) {
  const { contact } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{contact.name}</Text>
      <Text style={styles.role}>{contact.role}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{contact.phone}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{contact.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Office</Text>
        <Text style={styles.value}>{contact.office}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f7fb",
    padding: 16,
    gap: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f2d46",
  },
  role: {
    fontSize: 16,
    color: "#475467",
    marginBottom: 6,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d0d5dd",
    padding: 14,
  },
  label: {
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#667085",
    marginBottom: 3,
  },
  value: {
    fontSize: 17,
    color: "#101828",
    fontWeight: "600",
  },
});

export default ContactDetailsScreen;
