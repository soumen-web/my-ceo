import Constants from 'expo-constants';

import { env } from '@/config/env';
import { releaseMatrix } from '@/config/build-config/releaseMatrix';

export const buildConfig = {
  appEnvironment: env.appEnv,
  appVersion: Constants.expoConfig?.version ?? '1.0.0',
  easProjectId: env.easProjectId,
  releaseChannel: releaseMatrix[env.appEnv].releaseChannel,
} as const;
