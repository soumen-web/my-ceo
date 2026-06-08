import type {
  AppCapability,
  AppRole,
} from '@/shared/types/access';

export interface AccessContext {
  capabilities: AppCapability[];
  isAuthenticated: boolean;
  roles: AppRole[];
}

export type { AppCapability, AppRole };
