// AsyncStorage provides a simple key/value persistent store for React Native.
// We use it to persist the contacts locally on the device.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONTACTS_STORAGE_KEY } from "../constants/storage";
import { Contact } from "../types/contact";

export async function loadContacts(): Promise<Contact[]> {
  // Attempt to read the saved JSON string from storage.
  const savedContacts = await AsyncStorage.getItem(CONTACTS_STORAGE_KEY);

  // If nothing was saved yet, return an empty list.
  if (!savedContacts) {
    return [];
  }

  // Parse the JSON and return the typed array. If parsing fails for any
  // reason (corrupt data), return an empty array rather than throwing.
  try {
    return JSON.parse(savedContacts) as Contact[];
  } catch {
    return [];
  }
}

export async function saveContacts(contacts: Contact[]): Promise<void> {
  // Convert the contacts array to JSON and persist it under the storage key.
  // We don't handle errors here; callers can catch errors if needed.
  await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
}