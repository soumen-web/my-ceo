import * as SecureStore from 'expo-secure-store';

interface DeviceStorage {
  getItem<T>(key: string): Promise<T | null>;
  removeItem(key: string): Promise<void>;
  setItem<T>(key: string, value: T): Promise<void>;
}

export const deviceStorage: DeviceStorage = {
  async getItem<T>(key: string) {
    const rawValue = await SecureStore.getItemAsync(key);

    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as T;
  },
  async removeItem(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
  async setItem<T>(key: string, value: T) {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  },
};
