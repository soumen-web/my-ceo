import 'axios';

import type { ComplianceRequestContext } from '@compliance/core/types/api';

declare module 'axios' {
  interface AxiosRequestConfig {
    compliance?: ComplianceRequestContext;
  }

  interface InternalAxiosRequestConfig {
    compliance?: ComplianceRequestContext;
    metadata?: {
      compliance?: {
        auditAction?: string | undefined;
        operationName?: string | undefined;
        resource?: string | undefined;
        safePayload?: Record<string, unknown> | undefined;
      };
      hasRetriedWithRefresh?: boolean;
      skipAuthRefresh?: boolean;
      skipAuthToken?: boolean;
      skipGlobalLoader?: boolean;
      startedAt?: number;
    };
  }
}
