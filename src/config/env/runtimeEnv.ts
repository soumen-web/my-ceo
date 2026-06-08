import Constants from 'expo-constants';
import { Platform } from 'react-native';

import type { AppEnvironment } from '@/shared/types/env';

interface ExpoExtra {
  apiBaseUrl?: string;
  appEnv?: string;
  mediaBaseUrl?: string;
  tenantId?: string;
  eas?: {
    projectId?: string;
  };
}

const extra = (Constants.expoConfig?.extra ?? {}) as ExpoExtra;
const DEFAULT_APP_ENV: AppEnvironment = 'development';
const DEFAULT_API_BASE_URL = 'https://ultihuman-hrms-api.dedicateddevelopers.us/api/';
const DEFAULT_MEDIA_BASE_URL = 'https://ultihuman-hrms-api.dedicateddevelopers.us';
const DEFAULT_TENANT_ID = 'newgen';

const stripWrappingQuotes = (value: string): string =>
  value.trim().replace(/^['"]+|['"]+$/g, '');

const normalizeApiBaseUrl = (value: string): string => value.trim();
const normalizeMediaBaseUrl = (value: string): string => stripWrappingQuotes(value);
const normalizeTenantId = (value: string | undefined): string => {
  const normalizedValue = stripWrappingQuotes(value ?? DEFAULT_TENANT_ID);

  return normalizedValue || DEFAULT_TENANT_ID;
};
const isLocalhostHost = (hostname: string): boolean =>
  hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';

const resolveApiBaseUrl = (value: string | undefined): string => {
  const rawValue = value ? stripWrappingQuotes(value) : '';
  const normalizedWithProtocol = /^https?:\/\//i.test(rawValue)
    ? rawValue
    : rawValue
      ? `https://${rawValue}`
      : DEFAULT_API_BASE_URL;

  try {
    const parsedUrl = new URL(normalizedWithProtocol);

    // Android emulators can't reach host localhost directly.
    // In development, map localhost API targets to the emulator host bridge.
    if (
      __DEV__
      && Platform.OS === 'android'
      && isLocalhostHost(parsedUrl.hostname)
    ) {
      parsedUrl.hostname = '10.0.2.2';
    }

    if (parsedUrl.hostname.includes('example.com')) {
      return DEFAULT_API_BASE_URL;
    }

    if (!parsedUrl.pathname || parsedUrl.pathname === '/') {
      parsedUrl.pathname = '/api/';
      return parsedUrl.toString();
    }

    return parsedUrl.toString();
  } catch {
    return DEFAULT_API_BASE_URL;
  }
};

const resolveAppEnvironment = (value: string | undefined): AppEnvironment => {
  if (value === 'staging' || value === 'production') {
    return value;
  }

  return DEFAULT_APP_ENV;
};

export const runtimeEnv = {
  apiBaseUrl: normalizeApiBaseUrl(
    resolveApiBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL ?? extra.apiBaseUrl),
  ),
  mediaBaseUrl: normalizeMediaBaseUrl(
    process.env.EXPO_PUBLIC_MEDIA_BASE_URL ??
      extra.mediaBaseUrl ??
      DEFAULT_MEDIA_BASE_URL,
  ),
  tenantId: normalizeTenantId(process.env.EXPO_PUBLIC_TENANT_ID ?? extra.tenantId),
  appEnv: resolveAppEnvironment(
    process.env.EXPO_PUBLIC_APP_ENV ?? extra.appEnv ?? process.env.APP_ENV,
  ),
  easProjectId:
    extra.eas?.projectId ?? process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? '',
} as const;
