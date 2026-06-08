import type { AppCapability } from '@/shared/types/access';
import { usePolicyGate } from '@/services/policy/usePolicyGate';

export const usePermission = (capability: AppCapability): boolean => {
  return usePolicyGate({
    capability,
  });
};
