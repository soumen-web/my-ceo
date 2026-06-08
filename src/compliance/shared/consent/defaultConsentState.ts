import type {
  ConsentCategory,
  ConsentDecision,
  ConsentState,
} from '@compliance/core/types/consent';

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
