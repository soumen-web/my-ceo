import {
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios';

import { prepareApiRequestForCompliance } from '@compliance/core/interceptors/apiComplianceInterceptors';
import { logger } from '@/services/observability/logger/logger';
import { sessionStorage } from '@/services/storage/sessionStorage';

const maskTokenForLog = (token: string): string =>
  token.length > 12 ? `${token.slice(0, 8)}...${token.slice(-4)}` : '[PRESENT]';

export const attachAuthTokenInterceptor = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  config = await prepareApiRequestForCompliance(config);
  config.metadata = {
    ...config.metadata,
    startedAt: globalThis.performance?.now?.() ?? Date.now(),
  };

  if (config.metadata.skipAuthToken) {
    return config;
  }

  const accessToken = await sessionStorage.getAccessToken();

  if (!accessToken) {
    logger.info('API auth token state', {
      endpoint: config.url,
      hasAuth: false,
      method: config.method,
    });
    console.log('[DEBUG][API Token]', {
      endpoint: config.url,
      hasAuth: false,
      method: config.method,
    });

    return config;
  }

  const tokenPreview = maskTokenForLog(accessToken);

  logger.info('API auth token state', {
    endpoint: config.url,
    hasAuth: true,
    length: accessToken.length,
    method: config.method,
    preview: tokenPreview,
  });
  console.log('[DEBUG][API Token]', {
    endpoint: config.url,
    hasAuth: true,
    length: accessToken.length,
    method: config.method,
    preview: accessToken,
  });

  if (typeof config.headers?.set === 'function') {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
    return config;
  }

  const headers = new AxiosHeaders(config.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  config.headers = headers;

  return config;
};
