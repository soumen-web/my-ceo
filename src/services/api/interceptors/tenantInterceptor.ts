import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

import { tenantContextService } from '@/services/tenant/tenantContextService';

const TENANT_HEADER = 'x-tenant-id';

export const attachTenantHeaderInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const { tenantId } = tenantContextService.getSnapshot();

  if (!tenantId) {
    return config;
  }

  if (typeof config.headers?.set === 'function') {
    config.headers.set(TENANT_HEADER, tenantId);
    return config;
  }

  const headers = new AxiosHeaders(config.headers);
  headers.set(TENANT_HEADER, tenantId);
  config.headers = headers;

  return config;
};
