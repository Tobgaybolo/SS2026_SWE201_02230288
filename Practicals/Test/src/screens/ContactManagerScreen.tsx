import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Contact } from "../types/contact";
import { loadContacts, saveContacts } from "../services/contactStorage";

// Default/empty values used to reset the form inputs after saving.
const emptyForm = {
  name: "",
  phone: "",
  email: "",
};

export default function ContactManagerScreen() {
  // `contacts` holds the full list of saved contacts.
  const [contacts, setContacts] = useState<Contact[]>([]);
  // Controlled inputs for the add contact form.
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  // `loading` is true while initial contacts are loaded from storage.
  const [loading, setLoading] = useState(true);
  // `editingId` holds the id of the contact currently being edited,
  // or `null` when the form is used to create a new contact.
  const [editingId, setEditingId] = useState<string | null>(null);

  // On mount: load previously saved contacts from persistent storage.
  useEffect(() => {
    const bootstrapContacts = async () => {
      try {
        setContacts(await loadContacts());
      } catch {
        // Show a simple alert if storage read fails.
        Alert.alert("Storage error", "Could not load saved contacts.");
      } finally {
        setLoading(false);
      }
    };

    bootstrapContacts();
  }, []);

  // Persist contacts whenever they change, but only after initial load
  // completes (so we don't overwrite storage with an empty list on startup).
  useEffect(() => {
    if (loading) {
      return;
    }

    saveContacts(contacts).catch(() => {
      Alert.alert("Storage error", "Could not save contacts.");
    });
  }, [contacts, loading]);

  // Keep a memoized, alphabetically-sorted copy of the contacts for display.
  // `useMemo` avoids re-sorting on every render unless `contacts` changes.
  const sortedContacts = useMemo(
    () => [...contacts].sort((left, right) => left.name.localeCompare(right.name)),
    [contacts],
  );

  // Save a new contact or update an existing one when in edit mode.
  // IDs are generated using the timestamp + a small random suffix to avoid collisions.
  const addContact = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedPhone) {
      Alert.alert("Missing details", "Name and phone number are required.");
      return;
    }

    if (editingId) {
      // Update existing contact
      setContacts((currentContacts) =>
        currentContacts.map((c) =>
          c.id === editingId ? { ...c, name: trimmedName, phone: trimmedPhone, email: trimmedEmail } : c,
        ),
      );
      setEditingId(null);
    } else {
      // Create new contact and prepend to the list
      setContacts((currentContacts) => [
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name: trimmedName,
          phone: trimmedPhone,
          email: trimmedEmail,
        },
        ...currentContacts,
      ]);
    }

    // Reset the form fields after save/update.
    setName(emptyForm.name);
    setPhone(emptyForm.phone);
    setEmail(emptyForm.email);
  };

  // Remove a contact by filtering it out of the current list.
  const deleteContact = (contactId: string) => {
    setContacts((currentContacts) => currentContacts.filter((contact) => contact.id !== contactId));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Text style={styles.kicker}>Local only</Text>
            <Text style={styles.title}>Phone Contact Manager</Text>
            <Text style={styles.subtitle}>
              Add contacts, keep them on the device, and come back later with your data intact.
            </Text>
          </View>

          {/* Form for adding a new contact */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Add Contact</Text>

            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#7c8a9a"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor="#7c8a9a"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#7c8a9a"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {editingId ? (
              <View style={styles.formButtons}>
                <Pressable style={styles.primaryButton} onPress={addContact}>
                  <Text style={styles.primaryButtonText}>Update Contact</Text>
                </Pressable>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => {
                    // Cancel editing and reset the form
                    setEditingId(null);
                    setName(emptyForm.name);
                    setPhone(emptyForm.phone);
                    setEmail(emptyForm.email);
                  }}
                >
                  <Text style={styles.deleteButtonText}>Cancel</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.primaryButton} onPress={addContact}>
                <Text style={styles.primaryButtonText}>Save Contact</Text>
              </Pressable>
            )}
          </View>

          {/* Header showing the total count of saved contacts */}
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Saved Contacts</Text>
            <Text style={styles.listCount}>{sortedContacts.length} total</Text>
          </View>

            {/* Contacts list. `FlatList` renders `sortedContacts` with a compact
              card layout and a delete button for each entry. */}
            <FlatList
            data={sortedContacts}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>
                  {loading ? "Loading saved contacts..." : "No contacts yet"}
                </Text>
                <Text style={styles.emptyText}>
                  Add your first contact using the form above. It will be stored locally on this device.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.contactCard}>
                <View style={styles.contactTopRow}>
                  <View style={styles.contactIdentity}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactMeta}>{item.phone}</Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <Pressable
                      onPress={() => {
                        // Populate the form with the contact values for editing.
                        setName(item.name);
                        setPhone(item.phone);
                        setEmail(item.email);
                        setEditingId(item.id);
                      }}
                      style={styles.editButton}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>

                    <Pressable onPress={() => deleteContact(item.id)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </Pressable>
                  </View>
                </View>

                {item.email ? <Text style={styles.contactEmail}>{item.email}</Text> : null}
              </View>
            )}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    gap: 16,
    backgroundColor: "#0f172a",
  },
  hero: {
    paddingVertical: 12,
  },
  kicker: {
    color: "#7dd3fc",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  title: {
    color: "#f8fafc",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
  },
  subtitle: {
    marginTop: 10,
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    backgroundColor: "#ffffff",
    color: "#0f172a",
  },
  primaryButton: {
    backgroundColor: "#0284c7",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listCount: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
  },
  emptyState: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  emptyTitle: {
    color: "#f8fafc",
    fontSize: 16,
    fontWeight: "700",
  },
  emptyText: {
    marginTop: 8,
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 20,
  },
  contactCard: {
    backgroundColor: "#111c33",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 10,
  },
  contactTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  contactIdentity: {
    flex: 1,
  },
  contactName: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: "800",
  },
  contactMeta: {
    marginTop: 4,
    color: "#93c5fd",
    fontSize: 14,
  },
  contactEmail: {
    color: "#cbd5e1",
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#f59e0b",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  editButtonText: {
    color: "#071431",
    fontSize: 13,
    fontWeight: "700",
  },
  formButtons: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});