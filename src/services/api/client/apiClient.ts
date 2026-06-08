import {
  default as axios,
  isAxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { Platform } from 'react-native';

import { env } from '@/config/env';
import { runtimeConfig } from '@/config/runtime-config';
import { attachAuthTokenInterceptor } from '@/services/api/interceptors/authTokenInterceptor';
import {
  handleErrorResponse,
  handleSuccessfulResponse,
} from '@/services/api/interceptors/errorResponseInterceptor';
import { tryRefreshAndRetryRequest } from '@/services/api/interceptors/refreshTokenInterceptor';
import { attachTenantHeaderInterceptor } from '@/services/api/interceptors/tenantInterceptor';
import { globalLoaderService } from '@/services/ui/globalLoader/globalLoaderService';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-App-Environment': env.appEnv,
    'X-App-Platform': Platform.OS,
  },
  timeout: runtimeConfig.network.requestTimeoutMs,
});

const shouldShowGlobalLoader = (
  config: InternalAxiosRequestConfig | undefined,
): boolean => !config?.metadata?.skipGlobalLoader;

const attachRequestInterceptors = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  if (shouldShowGlobalLoader(config)) {
    globalLoaderService.beginRequest();
  }

  return attachAuthTokenInterceptor(attachTenantHeaderInterceptor(config));
};

const attachRequestErrorInterceptors = (error: unknown): Promise<never> => {
  const config = isAxiosError(error) ? error.config : undefined;

  if (shouldShowGlobalLoader(config)) {
    globalLoaderService.endRequest();
  }

  return Promise.reject(error);
};

const attachResponseInterceptors = <T>(
  response: AxiosResponse<T>,
): AxiosResponse<T> => {
  if (shouldShowGlobalLoader(response.config)) {
    globalLoaderService.endRequest();
  }

  return handleSuccessfulResponse(response);
};

const attachErrorInterceptors = async (
  error: unknown,
): Promise<AxiosResponse<unknown>> => {
  const config = isAxiosError(error) ? error.config : undefined;

  if (shouldShowGlobalLoader(config)) {
    globalLoaderService.endRequest();
  }

  const recoveredResponse = await tryRefreshAndRetryRequest(
    error,
    async (requestConfig) => apiClient.request(requestConfig),
  );

  if (recoveredResponse) {
    return recoveredResponse;
  }

  return handleErrorResponse(error);
};

apiClient.interceptors.request.use(
  attachRequestInterceptors,
  attachRequestErrorInterceptors,
);
apiClient.interceptors.response.use(
  attachResponseInterceptors,
  attachErrorInterceptors,
);
