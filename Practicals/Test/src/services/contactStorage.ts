import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONTACTS_STORAGE_KEY } from "../constants/storage";
import { Contact } from "../types/contact";

export async function loadContacts(): Promise<Contact[]> {
  const savedContacts = await AsyncStorage.getItem(CONTACTS_STORAGE_KEY);

  if (!savedContacts) {
    return [];
  }

  try {
    return JSON.parse(savedContacts) as Contact[];
  } catch {
    return [];
  }
}

export async function saveContacts(contacts: Contact[]): Promise<void> {
  await AsyncStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
}