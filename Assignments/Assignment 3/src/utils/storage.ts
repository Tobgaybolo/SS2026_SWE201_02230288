import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys used across the app
export const STORAGE_KEYS = {
  USER: 'tm_user',
  FILTERS: 'tm_filters',
};

// Save any JSON-serializable value
export const saveToStorage = async (key: string, value: unknown): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Storage save error [${key}]:`, error);
  }
};

// Load and parse a stored value, returns null if not found
export const loadFromStorage = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error(`Storage load error [${key}]:`, error);
    return null;
  }
};

// Remove a stored value
export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Storage remove error [${key}]:`, error);
  }
};