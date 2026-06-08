import { isAxiosError } from 'axios';

import { ApiClientError, type ApiErrorPayload } from '@/types/api';

export const normalizeApiError = (error: unknown): ApiClientError => {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;

    return new ApiClientError({
      code: payload?.code ?? 'REQUEST_FAILED',
      correlationId:
        payload?.correlationId ??
        (error.response?.headers?.['x-correlation-id'] as string | undefined),
      message: payload?.message ?? error.message ?? 'Unexpected request failure.',
      status: error.response?.status ?? 0,
    });
  }

  if (error instanceof Error) {
    return new ApiClientError({
      code: 'UNKNOWN_ERROR',
      message: error.message,
      status: 0,
    });
  }

  return new ApiClientError({
    code: 'UNKNOWN_ERROR',
    message: 'Unexpected application error.',
    status: 0,
  });
};
