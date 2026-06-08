import type { ConfigContext, ExpoConfig } from 'expo/config';

import appJson from './app.json' with { type: 'json' };

const expoConfig = appJson.expo as unknown as ExpoConfig & {
  extra?: Record<string, unknown>;
};

const getRuntimeExtra = () => ({
  appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? process.env.APP_ENV ?? 'development',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
  easProjectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID ?? '',
  mediaBaseUrl: process.env.EXPO_PUBLIC_MEDIA_BASE_URL ?? '',
  tenantId: process.env.EXPO_PUBLIC_TENANT_ID,
});

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  ...expoConfig,
  extra: {
    ...expoConfig.extra,
    ...config.extra,
    ...getRuntimeExtra(),
  },
  plugins: [
    ...(expoConfig.plugins ?? []),
    'expo-font',
    'expo-image',
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Allow MyCEO to capture your location after login.',
      },
    ],
    'expo-secure-store',
  ],
});
