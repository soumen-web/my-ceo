export const CONSENT_CATEGORIES = [
  'necessary',
  'analytics',
  'data_export',
  'profiling',
] as const;

export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];
export type ConsentDecision = 'denied' | 'granted' | 'unknown';

export interface ConsentState {
  categories: Record<ConsentCategory, ConsentDecision>;
  privacyNoticeAccepted: boolean;
  region?: string | undefined;
  updatedAt?: string | undefined;
}
