import { STORAGE_KEYS } from '@/shared/constants/storageKeys';
import { complianceStorage } from '@compliance/shared/storage/complianceStorage';

export interface StoredSessionTokens {
  accessToken: string;
  refreshToken?: string;
}

export const sessionStorage = {
  async clear(): Promise<void> {
    await complianceStorage.remove(STORAGE_KEYS.accessToken, 'secure');
    await complianceStorage.remove(STORAGE_KEYS.refreshToken, 'secure');
  },
  async getAccessToken(): Promise<string | null> {
    return complianceStorage.read<string>({
      classification: 'CREDENTIAL_SECRET',
      key: STORAGE_KEYS.accessToken,
      target: 'secure',
    });
  },
  async getRefreshToken(): Promise<string | null> {
    return complianceStorage.read<string>({
      classification: 'CREDENTIAL_SECRET',
      key: STORAGE_KEYS.refreshToken,
      target: 'secure',
    });
  },
  async store(tokens: StoredSessionTokens): Promise<void> {
    await complianceStorage.write({
      auditLabel: 'session_access_token',
      classification: 'CREDENTIAL_SECRET',
      key: STORAGE_KEYS.accessToken,
      target: 'secure',
      value: tokens.accessToken,
    });

    if (tokens.refreshToken) {
      await complianceStorage.write({
        auditLabel: 'session_refresh_token',
        classification: 'CREDENTIAL_SECRET',
        key: STORAGE_KEYS.refreshToken,
        target: 'secure',
        value: tokens.refreshToken,
      });
      return;
    }

    await complianceStorage.remove(STORAGE_KEYS.refreshToken, 'secure');
  },
};
