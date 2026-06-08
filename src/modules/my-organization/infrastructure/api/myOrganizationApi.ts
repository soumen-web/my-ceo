import { isAxiosError } from 'axios';

import { env } from '@/config/env';
import { API } from '@/services/api/apiEndpoints';
import { apiClient } from '@/services/api/client/apiClient';
import { mapApiError } from '@/services/api/error-mapping/mapApiError';
import { AppError, ServerError } from '@/shared/core/errors/AppError';

import type { OrganizationAnalyticsResponseDto } from '../dtos/OrganizationAnalyticsDto';

const resolveApiUrl = (endpoint: string): string => {
  const baseUrl = env.apiBaseUrl.endsWith('/') ? env.apiBaseUrl : `${env.apiBaseUrl}/`;
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  return new URL(normalizedEndpoint, baseUrl).toString();
};

const toResponseSummary = (response: OrganizationAnalyticsResponseDto) => ({
  hasBusinessUnit: Boolean(response.data?.organization?.businessUnit?.name),
  hasDepartment: Boolean(response.data?.team?.department?.name ?? response.data?.organization?.department?.name),
  hasLegalEntity: Boolean(response.data?.organization?.legalEntity?.name),
  hasOrganization: Boolean(response.data?.organization?.org?.name),
  hasReportingManager: Boolean(response.data?.reportingManager?.displayName),
  hasTeam: Boolean(response.data?.team?.name ?? response.data?.organization?.team?.name),
  message: response.message,
  statusCode: response.statusCode,
  success: response.success,
});

const toErrorResponseSummary = (error: unknown) => {
  if (!isAxiosError(error)) {
    return undefined;
  }

  const data = error.response?.data;

  if (typeof data === 'string') {
    return data;
  }

  if (data && typeof data === 'object') {
    const payload = data as {
      message?: unknown;
      statusCode?: unknown;
      success?: unknown;
    };

    return {
      message: payload.message,
      statusCode: payload.statusCode,
      success: payload.success,
    };
  }

  return undefined;
};

const logOrganizationAnalyticsRequestInDev = (endpoint: string) => {
  if (!__DEV__) {
    return;
  }

  console.info('[MyOrganization API] Analytics request', {
    endpoint,
    method: 'GET',
    payload: null,
    url: resolveApiUrl(endpoint),
  });
};

const logOrganizationAnalyticsResponseInDev = (response: OrganizationAnalyticsResponseDto) => {
  if (!__DEV__) {
    return;
  }

  console.info('[MyOrganization API] Analytics response', toResponseSummary(response));
};

const logOrganizationAnalyticsErrorInDev = (error: unknown) => {
  if (!__DEV__) {
    return;
  }

  console.warn('[MyOrganization API] Analytics error', {
    response: toErrorResponseSummary(error),
    status: isAxiosError(error) ? error.response?.status : undefined,
  });
};

const assertOrganizationAnalyticsEnvelope = (
  response: OrganizationAnalyticsResponseDto,
): OrganizationAnalyticsResponseDto => {
  if (response.success === false || !response.data) {
    throw new ServerError('Invalid my organization analytics response.', {
      details: {
        hasData: Boolean(response.data),
        success: response.success,
      },
      userMessage:
        response.message ?? 'Unable to load organization data. Please try again.',
    });
  }

  return response;
};

export const myOrganizationApi = {
  async fetchMyOrganizationAnalytics(): Promise<OrganizationAnalyticsResponseDto> {
    const endpoint = API.myOrganization.analytics;

    try {
      logOrganizationAnalyticsRequestInDev(endpoint);

      const response = await apiClient.get<OrganizationAnalyticsResponseDto>(endpoint);

      logOrganizationAnalyticsResponseInDev(response.data);

      return assertOrganizationAnalyticsEnvelope(response.data);
    } catch (error) {
      logOrganizationAnalyticsErrorInDev(error);
      if (error instanceof AppError) {
        throw error;
      }

      throw mapApiError(error);
    }
  },
};
