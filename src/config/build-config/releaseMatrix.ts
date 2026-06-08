import type { AppEnvironment } from '@shared/types/env';

export type AnalyticsMode = 'disabled' | 'standard' | 'verbose';
export type ConsoleLogLevel = 'debug' | 'info' | 'warn';
export type OtaUpdatePolicy = 'manual' | 'reviewed';
export type ReleaseChannel = 'development' | 'staging' | 'production';

interface ReleaseMatrixEntry {
  analyticsMode: AnalyticsMode;
  capturePerformance: boolean;
  consoleLogLevel: ConsoleLogLevel;
  crashReportingEnabled: boolean;
  otaUpdatePolicy: OtaUpdatePolicy;
  releaseChannel: ReleaseChannel;
}

export const releaseMatrix: Record<AppEnvironment, ReleaseMatrixEntry> = {
  development: {
    analyticsMode: 'verbose',
    capturePerformance: true,
    consoleLogLevel: 'debug',
    crashReportingEnabled: false,
    otaUpdatePolicy: 'manual',
    releaseChannel: 'development',
  },
  production: {
    analyticsMode: 'standard',
    capturePerformance: true,
    consoleLogLevel: 'warn',
    crashReportingEnabled: true,
    otaUpdatePolicy: 'reviewed',
    releaseChannel: 'production',
  },
  staging: {
    analyticsMode: 'standard',
    capturePerformance: true,
    consoleLogLevel: 'info',
    crashReportingEnabled: true,
    otaUpdatePolicy: 'reviewed',
    releaseChannel: 'staging',
  },
};
