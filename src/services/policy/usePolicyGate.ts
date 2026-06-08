import { env } from '@config/env';
import { featureFlagService } from '@config/feature-flags/featureFlagService';
import { useAppSelector } from '@app/providers/state/hooks';
import { selectAccessContext } from '@modules/auth';
import { policyService } from '@services/policy/policyService';

import type { PolicyRule } from '@services/policy/types';

export const usePolicyGate = (rule: PolicyRule): boolean => {
  const access = useAppSelector(selectAccessContext);

  return policyService.canAccess(
    {
      access,
      environment: env.appEnv,
      featureFlags: featureFlagService.getSnapshot(),
    },
    rule,
  );
};
