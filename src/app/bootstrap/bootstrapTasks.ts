import { buildConfig } from '@config/build-config';
import { featureFlags } from '@config/feature-flags';
import { featureFlagService } from '@config/feature-flags/featureFlagService';
import { env } from '@config/env';
import { homeUseCases } from '@modules/home';
import {
  authUseCases,
  clearSessionError,
  completeSessionHydration,
} from '@modules/auth';
import { analyticsService } from '@services/observability/analytics/analyticsService';
import { observabilityEvents } from '@services/observability/events';
import { logger } from '@services/observability/logger/logger';
import { toAppError } from '@shared/core/errors/AppError';
import { runtimeWorkflowService } from '@services/runtime/runtimeWorkflowService';
import {
  resetHomeDashboard,
  setHomeDashboard,
} from '@/store/slices/homeSlice';
import type { HomeDashboard } from '@/modules/home/domain/entities/HomeDashboard';

import { initializeMonitoring } from './initializeMonitoring';

import type { BootstrapTask } from '@app/bootstrap/types';

export const createBootstrapTasks = (): BootstrapTask[] => [
  {
    execute: async () => {
      void env.apiBaseUrl;
      void env.appEnv;
      void buildConfig.releaseChannel;
    },
    key: 'validate-runtime-configuration',
  },
  {
    execute: async () => {
      featureFlagService.initialize(featureFlags);
    },
    key: 'initialize-feature-flags',
  },
  {
    critical: false,
    execute: async () => {
      initializeMonitoring();
    },
    key: 'initialize-observability',
  },
  {
    critical: false,
    execute: async () => {
      runtimeWorkflowService.initialize();
    },
    key: 'initialize-runtime-workflows',
  },
  {
    critical: false,
    execute: async () => {
      // Fonts are not custom-loaded yet, but the bootstrap contract keeps
      // design-system readiness explicit for future growth.
    },
    key: 'prepare-design-system-readiness',
  },
  {
    execute: async ({ dispatch }) => {
      const restoredSession = await authUseCases.restoreSession.execute();
      dispatch(completeSessionHydration(restoredSession));

      if (restoredSession.isAuthenticated) {
        analyticsService.track(observabilityEvents.authSessionRestored);

        try {
          const dashboard: HomeDashboard = homeUseCases.getDashboard.execute();
          dispatch(setHomeDashboard(dashboard));
        } catch (error) {
          const appError = toAppError(error);

          logger.warn('Unable to hydrate Workforce Hub dashboard during bootstrap.', {
            code: appError.code,
            details: appError.details,
            scope: 'bootstrapTasks',
          });
        }
      } else {
        dispatch(resetHomeDashboard());
      }
    },
    key: 'restore-secure-session',
  },
  {
    critical: false,
    execute: async ({ dispatch }) => {
      dispatch(clearSessionError(undefined));
    },
    key: 'finalize-startup-state',
  },
];
