import { isAxiosError } from 'axios';

import {
  AuthenticationError,
  AuthorizationError,
  NetworkError,
  ServerError,
  UnknownAppError,
  ValidationError,
  type AppError,
} from '@/shared/core/errors/AppError';

interface ApiErrorPayload {
  code?: string;
  correlationId?: string;
  message?: string;
}

const extractPayload = (error: unknown): ApiErrorPayload | undefined => {
  if (!isAxiosError(error)) {
    return undefined;
  }

  return error.response?.data as ApiErrorPayload | undefined;
};

export const mapApiError = (error: unknown): AppError => {
  if (isAxiosError(error)) {
    const payload = extractPayload(error);
    const commonDetails = {
      correlationId:
        payload?.correlationId ??
        (error.response?.headers?.['x-correlation-id'] as string | undefined),
      status: error.response?.status ?? 0,
    };

    if (!error.response) {
      return new NetworkError('Unable to reach the server.', {
        cause: error,
        details: commonDetails,
      });
    }

    if (error.response.status === 400 || error.response.status === 422) {
      return new ValidationError(
        payload?.message ?? 'The request was rejected by validation rules.',
        {
          cause: error,
          details: commonDetails,
          userMessage: payload?.message ?? 'Check the supplied details and try again.',
        },
      );
    }

    if (error.response.status === 401) {
      return new AuthenticationError(
        payload?.message ?? 'Your session is no longer valid.',
        {
          cause: error,
          details: commonDetails,
          userMessage: 'Your session expired. Please sign in again.',
        },
      );
    }

    if (error.response.status === 403) {
      return new AuthorizationError(
        payload?.message ?? 'You do not have permission for this operation.',
        {
          cause: error,
          details: commonDetails,
        },
      );
    }

    if (error.response.status >= 500) {
      return new ServerError(
        payload?.message ?? 'The service is temporarily unavailable.',
        {
          cause: error,
          details: commonDetails,
          userMessage: 'The service is temporarily unavailable. Please try again shortly.',
        },
      );
    }

    return new UnknownAppError(
      payload?.message ?? error.message ?? 'Unexpected API failure.',
      {
        cause: error,
        details: commonDetails,
      },
    );
  }

  if (error instanceof Error) {
    return new UnknownAppError(error.message, {
      cause: error,
    });
  }

  return new UnknownAppError();
};
