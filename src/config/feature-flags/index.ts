import { featureFlagService } from '@/config/feature-flags/featureFlagService';

export const featureFlags = {
  enableLifecycleTelemetry: true,
  enableObservability: true,
  enablePerformanceTracing: true,
  enableProfileModule: true,
} as const;

featureFlagService.initialize(featureFlags);
