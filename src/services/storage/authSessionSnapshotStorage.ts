import { STORAGE_KEYS } from '@/shared/constants/storageKeys';

import { deviceStorage } from './deviceStorage';

interface StoredApiUserRole {
  _id?: string;
  role?: string;
  roleDisplayName?: string;
}

interface StoredApiUser {
  accountType?: string;
  createdAt?: string;
  email: string;
  firstName?: string;
  fullName?: string;
  id: string;
  isEmailVerified?: boolean;
  lastName?: string;
  messages?: unknown[];
  profileImage?: string;
  role?: StoredApiUserRole;
  status?: string;
  userName?: string;
}

interface StoredDomainUser {
  capabilities: string[];
  email: string;
  firstName?: string;
  id: string;
  lastName?: string;
  profileImage?: string;
  roles: string[];
}

export interface StoredAuthSessionSnapshot {
  accessToken: string;
  refreshToken?: string;
  user: StoredApiUser;
  userDomain: StoredDomainUser;
}

export const authSessionSnapshotStorage = {
  async clear(): Promise<void> {
    await deviceStorage.removeItem(STORAGE_KEYS.authSessionSnapshot);
  },
  async get(): Promise<StoredAuthSessionSnapshot | null> {
    return deviceStorage.getItem<StoredAuthSessionSnapshot>(
      STORAGE_KEYS.authSessionSnapshot,
    );
  },
  async store(snapshot: StoredAuthSessionSnapshot): Promise<void> {
    await deviceStorage.setItem(STORAGE_KEYS.authSessionSnapshot, snapshot);
  },
  async updateProfileImage(profileImage: string): Promise<void> {
    const normalizedProfileImage = profileImage.trim();

    if (!normalizedProfileImage) {
      return;
    }

    const currentSnapshot = await this.get();

    if (!currentSnapshot) {
      return;
    }

    await this.store({
      ...currentSnapshot,
      user: {
        ...currentSnapshot.user,
        profileImage: normalizedProfileImage,
      },
      userDomain: {
        ...currentSnapshot.userDomain,
        profileImage: normalizedProfileImage,
      },
    });
  },
};
