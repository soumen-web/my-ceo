import type { FeatureFlags } from '@config/feature-flags/types';

let activeFeatureFlags: FeatureFlags | null = null;

export const featureFlagService = {
  getSnapshot(): FeatureFlags {
    if (!activeFeatureFlags) {
      throw new Error('Feature flags have not been initialized.');
    }

    return activeFeatureFlags;
  },
  initialize(flags: FeatureFlags): FeatureFlags {
    activeFeatureFlags = flags;
    return activeFeatureFlags;
  },
  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.getSnapshot()[flag];
  },
};
