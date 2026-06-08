import * as SecureStore from 'expo-secure-store';

interface SensitiveStorage {
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  setItem(key: string, value: string): Promise<void>;
}

export const sensitiveStorage: SensitiveStorage = {
  async getItem(key) {
    return SecureStore.getItemAsync(key);
  },
  async removeItem(key) {
    await SecureStore.deleteItemAsync(key);
  },
  async setItem(key, value) {
    await SecureStore.setItemAsync(key, value);
  },
};
