import type { FeatureFlags } from '@config/feature-flags/types';
import type { AppEnvironment } from '@shared/types/env';
import type { AccessContext, AppCapability } from '@services/access-control/types';

export type SubscriptionPlan = 'enterprise' | 'premium' | 'standard';

export interface PolicyContext {
  access: AccessContext;
  environment: AppEnvironment;
  featureFlags: FeatureFlags;
  subscriptionPlan?: SubscriptionPlan;
  tenantCapabilities?: string[];
}

export interface PolicyRule {
  allowedEnvironments?: AppEnvironment[];
  capability?: AppCapability;
  featureFlag?: keyof FeatureFlags;
  subscriptionPlans?: SubscriptionPlan[];
  tenantCapability?: string;
}
