import {
  AxiosHeaders,
  create as createAxiosClient,
  isAxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { Platform } from 'react-native';

import { env } from '@/config/env';
import { runtimeConfig } from '@/config/runtime-config';
import { API } from '@/services/api/apiEndpoints';
import { attachTenantHeaderInterceptor } from '@/services/api/interceptors/tenantInterceptor';
import { authSessionSnapshotStorage } from '@/services/storage/authSessionSnapshotStorage';
import { sessionStorage } from '@/services/storage/sessionStorage';

interface RefreshTokenApiResponse {
  accessToken?: string;
  data?: RefreshTokenApiResponse;
  refreshToken?: string;
  token?: string;
}

interface RefreshedTokens {
  accessToken: string;
  refreshToken: string;
}

type RetryRequest = (
  config: InternalAxiosRequestConfig,
) => Promise<AxiosResponse<unknown>>;

const refreshClient = createAxiosClient({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'X-App-Environment': env.appEnv,
    'X-App-Platform': Platform.OS,
  },
  timeout: runtimeConfig.network.requestTimeoutMs,
});

refreshClient.interceptors.request.use((config) => attachTenantHeaderInterceptor(config));

let inFlightRefreshPromise: Promise<RefreshedTokens | null> | null = null;

const normalizeToken = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
};

const parseRefreshedTokens = (
  payload: RefreshTokenApiResponse | undefined,
): {
  accessToken: string | null;
  refreshToken: string | null;
} => {
  const nestedData = payload?.data;
  const deepNestedData = nestedData?.data;

  return {
    accessToken:
      normalizeToken(payload?.accessToken) ??
      normalizeToken(payload?.token) ??
      normalizeToken(nestedData?.accessToken) ??
      normalizeToken(nestedData?.token) ??
      normalizeToken(deepNestedData?.accessToken) ??
      normalizeToken(deepNestedData?.token),
    refreshToken:
      normalizeToken(payload?.refreshToken) ??
      normalizeToken(nestedData?.refreshToken) ??
      normalizeToken(deepNestedData?.refreshToken),
  };
};

const setAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
  accessToken: string,
): void => {
  if (typeof config.headers?.set === 'function') {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
    return;
  }

  const headers = new AxiosHeaders(config.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  config.headers = headers;
};

const hasAuthorizationHeader = (
  config: InternalAxiosRequestConfig,
): boolean => {
  if (typeof config.headers?.get === 'function') {
    const headerValue =
      config.headers.get('Authorization') ??
      config.headers.get('authorization');

    return Boolean(normalizeToken(headerValue));
  }

  if (!config.headers || typeof config.headers !== 'object') {
    return false;
  }

  const headersRecord = config.headers as Record<string, unknown>;

  return Boolean(
    normalizeToken(headersRecord.Authorization) ??
      normalizeToken(headersRecord.authorization),
  );
};

const isRefreshRequest = (url: string | undefined): boolean =>
  Boolean(url && url.includes(API.auth.refresh));

const updateSnapshotTokens = async (
  tokens: RefreshedTokens,
): Promise<void> => {
  const snapshot = await authSessionSnapshotStorage.get();

  if (!snapshot) {
    return;
  }

  await authSessionSnapshotStorage.store({
    ...snapshot,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

const requestTokenRefresh = async (): Promise<RefreshedTokens | null> => {
  const storedRefreshToken = normalizeToken(
    await sessionStorage.getRefreshToken(),
  );

  if (!storedRefreshToken) {
    return null;
  }

  try {
    const response = await refreshClient.post<RefreshTokenApiResponse>(
      API.auth.refresh,
      {
        refreshToken: storedRefreshToken,
      },
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
      },
    );
    const parsedTokens = parseRefreshedTokens(response.data);

    if (!parsedTokens.accessToken) {
      return null;
    }

    const refreshedTokens: RefreshedTokens = {
      accessToken: parsedTokens.accessToken,
      refreshToken: parsedTokens.refreshToken ?? storedRefreshToken,
    };

    await Promise.all([
      sessionStorage.store(refreshedTokens),
      updateSnapshotTokens(refreshedTokens),
    ]);

    return refreshedTokens;
  } catch {
    return null;
  }
};

const refreshTokensSingleFlight = async (): Promise<RefreshedTokens | null> => {
  if (inFlightRefreshPromise) {
    return inFlightRefreshPromise;
  }

  inFlightRefreshPromise = requestTokenRefresh().finally(() => {
    inFlightRefreshPromise = null;
  });

  return inFlightRefreshPromise;
};

export const tryRefreshAndRetryRequest = async (
  error: unknown,
  retryRequest: RetryRequest,
): Promise<AxiosResponse<unknown> | null> => {
  if (!isAxiosError(error) || error.response?.status !== 401) {
    return null;
  }

  const requestConfig = error.config;

  if (!requestConfig) {
    return null;
  }

  if (requestConfig.metadata?.hasRetriedWithRefresh) {
    return null;
  }

  if (requestConfig.metadata?.skipAuthRefresh || isRefreshRequest(requestConfig.url)) {
    return null;
  }

  if (!hasAuthorizationHeader(requestConfig)) {
    return null;
  }

  const refreshedTokens = await refreshTokensSingleFlight();

  if (!refreshedTokens) {
    return null;
  }

  requestConfig.metadata = {
    ...requestConfig.metadata,
    hasRetriedWithRefresh: true,
  };
  setAuthorizationHeader(requestConfig, refreshedTokens.accessToken);

  return retryRequest(requestConfig);
};
