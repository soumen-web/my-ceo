import { isAxiosError, type AxiosResponse } from 'axios';

import { mapApiError } from '@/services/api/error-mapping/mapApiError';
import { logger } from '@/services/observability/logger/logger';
import { authSessionSnapshotStorage } from '@/services/storage/authSessionSnapshotStorage';
import { sessionStorage } from '@/services/storage/sessionStorage';
import { analyticsService } from '@services/observability/analytics/analyticsService';
import { observabilityEvents } from '@services/observability/events';
import { performanceMonitor } from '@services/observability/performance/performanceMonitor';

const getDurationMs = (startedAt: number | undefined): number =>
  Math.max(0, Math.round((globalThis.performance?.now?.() ?? Date.now()) - (startedAt ?? 0)));

const getRequestOperation = (
  method: string | undefined,
  url: string | undefined,
): string => `${(method ?? 'get').toUpperCase()} ${url ?? 'unknown'}`;

type UnauthorizedHandler = () => void;

const unauthorizedHandlers = new Set<UnauthorizedHandler>();

export const authApiLifecycle = {
  emitUnauthorized() {
    unauthorizedHandlers.forEach((handler) => handler());
  },
  subscribeUnauthorized(handler: UnauthorizedHandler) {
    unauthorizedHandlers.add(handler);

    return () => {
      unauthorizedHandlers.delete(handler);
    };
  },
};

export const handleSuccessfulResponse = <T>(
  response: AxiosResponse<T>,
): AxiosResponse<T> => {
  const operation = getRequestOperation(response.config.method, response.config.url);
  const durationMs = getDurationMs(response.config.metadata?.startedAt);

  performanceMonitor.recordApiLatency(operation, durationMs, {
    status: response.status,
  });
  analyticsService.track(observabilityEvents.apiRequestCompleted, {
    durationMs,
    operation,
    status: response.status,
  });

  return response;
};

export const handleErrorResponse = async (error: unknown): Promise<never> => {
  const appError = mapApiError(error);
  const isAxiosRequestError = isAxiosError(error);
  const operation = isAxiosRequestError
    ? getRequestOperation(error.config?.method, error.config?.url)
    : 'UNKNOWN';
  const durationMs = isAxiosRequestError
    ? getDurationMs(error.config?.metadata?.startedAt)
    : 0;

  if (appError.code === 'AUTHENTICATION_ERROR') {
    await Promise.all([
      sessionStorage.clear(),
      authSessionSnapshotStorage.clear(),
    ]);
    authApiLifecycle.emitUnauthorized();
  }

  performanceMonitor.recordApiLatency(operation, durationMs, {
    outcome: 'error',
    status: appError.details?.status,
  });
  analyticsService.track(observabilityEvents.apiRequestFailed, {
    code: appError.code,
    durationMs,
    operation,
    status: appError.details?.status,
  });
  logger.warn('API request failed', {
    code: appError.code,
    details: appError.details,
    message: appError.message,
  });

  return Promise.reject(appError);
};
