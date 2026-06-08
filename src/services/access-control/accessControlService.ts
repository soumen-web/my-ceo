import type {
  AccessContext,
  AppCapability,
  AppRole,
} from '@/services/access-control/types';

const fallbackCapabilities: AppCapability[] = ['auth:access', 'home:view', 'profile:view'];

export const accessControlService = {
  buildAuthenticatedContext(
    roles: AppRole[] = ['member'],
    capabilities: AppCapability[] = fallbackCapabilities,
  ): AccessContext {
    return {
      capabilities,
      isAuthenticated: true,
      roles,
    };
  },
  buildGuestContext(): AccessContext {
    return {
      capabilities: [],
      isAuthenticated: false,
      roles: [],
    };
  },
  canAccess(context: AccessContext, capability: AppCapability): boolean {
    if (!context.isAuthenticated) {
      return false;
    }

    return context.capabilities.includes(capability);
  },
};
