import { env } from '@/config/env';

export interface TenantContextSnapshot {
  tenantId: string;
}

let runtimeTenantId: string | null = null;

const normalizeTenantId = (value: string): string => value.trim();

export const tenantContextService = {
  clearRuntimeTenant(): void {
    runtimeTenantId = null;
  },
  getSnapshot(): TenantContextSnapshot {
    return {
      tenantId: runtimeTenantId ?? env.tenantId,
    };
  },
  setRuntimeTenant(tenantId: string): void {
    const normalizedTenantId = normalizeTenantId(tenantId);

    if (!normalizedTenantId) {
      runtimeTenantId = null;
      return;
    }

    runtimeTenantId = normalizedTenantId;
  },
};
