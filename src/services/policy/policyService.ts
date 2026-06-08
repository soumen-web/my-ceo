import { accessControlService } from '@services/access-control/accessControlService';

import type { PolicyContext, PolicyRule } from '@services/policy/types';

const isEnvironmentAllowed = (
  context: PolicyContext,
  rule: PolicyRule,
): boolean =>
  !rule.allowedEnvironments ||
  rule.allowedEnvironments.includes(context.environment);

const isFeatureFlagEnabled = (
  context: PolicyContext,
  rule: PolicyRule,
): boolean =>
  !rule.featureFlag || context.featureFlags[rule.featureFlag];

const hasRequiredCapability = (
  context: PolicyContext,
  rule: PolicyRule,
): boolean =>
  !rule.capability ||
  accessControlService.canAccess(context.access, rule.capability);

const hasRequiredSubscription = (
  context: PolicyContext,
  rule: PolicyRule,
): boolean => {
  if (!rule.subscriptionPlans) {
    return true;
  }

  if (!context.subscriptionPlan) {
    return false;
  }

  return rule.subscriptionPlans.includes(context.subscriptionPlan);
};

const hasTenantCapability = (
  context: PolicyContext,
  rule: PolicyRule,
): boolean =>
  !rule.tenantCapability ||
  context.tenantCapabilities?.includes(rule.tenantCapability) === true;

export const policyService = {
  canAccess(context: PolicyContext, rule: PolicyRule): boolean {
    return (
      isEnvironmentAllowed(context, rule) &&
      isFeatureFlagEnabled(context, rule) &&
      hasRequiredCapability(context, rule) &&
      hasRequiredSubscription(context, rule) &&
      hasTenantCapability(context, rule)
    );
  },
};
