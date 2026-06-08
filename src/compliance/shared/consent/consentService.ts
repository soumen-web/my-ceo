import { STORAGE_KEYS } from '@shared/constants/storageKeys';

import type {
  ConsentCategory,
  ConsentDecision,
  ConsentState,
} from '@compliance/core/types/consent';
import type { ComplianceConfig } from '@compliance/core/types/config';
import { complianceStorage } from '@compliance/shared/storage/complianceStorage';

const defaultCategories = (): Record<ConsentCategory, ConsentDecision> => ({
  analytics: 'unknown',
  data_export: 'unknown',
  necessary: 'granted',
  profiling: 'unknown',
});

export const createDefaultConsentState = (region?: string): ConsentState => ({
  categories: defaultCategories(),
  privacyNoticeAccepted: false,
  region,
});

let inMemoryConsentState = createDefaultConsentState();

export const consentService = {
  async hydrate(config: ComplianceConfig): Promise<ConsentState> {
    const persistedConsentState = await complianceStorage.read<ConsentState>({
      classification: 'REGULATED_METADATA',
      key: STORAGE_KEYS.complianceConsent,
      target: 'device',
    });

    inMemoryConsentState =
      persistedConsentState ?? createDefaultConsentState(config.region);
    return inMemoryConsentState;
  },
  getState(): ConsentState {
    return inMemoryConsentState;
  },
  async update(
    updates: Partial<ConsentState>,
    config: ComplianceConfig,
  ): Promise<ConsentState> {
    inMemoryConsentState = {
      ...createDefaultConsentState(config.region),
      ...inMemoryConsentState,
      ...updates,
      categories: {
        ...defaultCategories(),
        ...inMemoryConsentState.categories,
        ...updates.categories,
      },
      updatedAt: new Date().toISOString(),
    };

    await complianceStorage.write({
      classification: 'REGULATED_METADATA',
      key: STORAGE_KEYS.complianceConsent,
      target: 'device',
      value: inMemoryConsentState,
    });
    return inMemoryConsentState;
  },
};
