import { API_TIMEOUT_MS } from '@/shared/constants/app';
import { buildConfig } from '@/config/build-config';
import { releaseMatrix } from '@/config/build-config/releaseMatrix';
import { env } from '@/config/env';
import { performanceBudgets } from '@/shared/constants/performanceBudgets';

const activeReleaseConfig = releaseMatrix[env.appEnv];

export const runtimeConfig = {
  network: {
    requestTimeoutMs: API_TIMEOUT_MS,
  },
  observability: {
    analyticsMode: activeReleaseConfig.analyticsMode,
    capturePerformance: activeReleaseConfig.capturePerformance,
    crashReportingEnabled: activeReleaseConfig.crashReportingEnabled,
    enableConsoleLogs: activeReleaseConfig.consoleLogLevel !== 'warn',
    logLevel: activeReleaseConfig.consoleLogLevel,
  },
  performance: {
    budgets: performanceBudgets,
  },
  query: {
    enableReconnectRefetch: true,
  },
  release: {
    otaUpdatePolicy: activeReleaseConfig.otaUpdatePolicy,
    releaseChannel: buildConfig.releaseChannel,
  },
} as const;
