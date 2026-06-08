import { useCallback, useEffect, useState } from 'react';

import { authUseCases, clearSession } from '@modules/auth';
import { analyticsService } from '@services/observability/analytics/analyticsService';
import { authApiLifecycle } from '@services/api/interceptors/errorResponseInterceptor';
import { observabilityEvents } from '@services/observability/events';
import { logger } from '@services/observability/logger/logger';
import { runtimeWorkflowService } from '@services/runtime/runtimeWorkflowService';
import { toAppError } from '@shared/core/errors/AppError';
import { tenantContextService } from '@/services/tenant/tenantContextService';
import { useAppDispatch } from '@/store/hooks';
import { resetHomeDashboard } from '@/store/slices/homeSlice';
import { resetHrms } from '@/store/slices/hrmsSlice';
import { resetMyOrganization } from '@/store/slices/myOrganizationSlice';

import { createBootstrapTasks } from '@app/bootstrap/bootstrapTasks';
import { runBootstrapPipeline } from '@app/bootstrap/bootstrapPipeline';

type StartupStatus = 'failed' | 'idle' | 'ready' | 'running';

export const useAppStartup = () => {
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<StartupStatus>('idle');

  const runStartup = useCallback(async () => {
    setErrorMessage(null);
    setStatus('running');

    const result = await runBootstrapPipeline(createBootstrapTasks(), {
      dispatch,
    });

    if (!result.isReady) {
      const [firstFailure] = result.failures;

      if (firstFailure) {
        logger.error(firstFailure.error, {
          scope: 'AppStartup',
          taskKey: firstFailure.key,
        });
        setErrorMessage(firstFailure.error.userMessage);
      }

      setStatus('failed');
      return;
    }

    setStatus('ready');
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = authApiLifecycle.subscribeUnauthorized(() => {
      void authUseCases.signOutUser.execute();
      tenantContextService.clearRuntimeTenant();
      dispatch(clearSession(undefined));
      dispatch(resetHomeDashboard(undefined));
      dispatch(resetHrms(undefined));
      dispatch(resetMyOrganization(undefined));
      analyticsService.track(observabilityEvents.authUnauthorized, {
        reason: 'api_401',
      });
    });

    const startupTimeout = setTimeout(() => {
      void runStartup();
    }, 0);

    return () => {
      clearTimeout(startupTimeout);
      unsubscribe();
      runtimeWorkflowService.dispose();
    };
  }, [dispatch, runStartup]);

  return {
    errorMessage,
    isReady: status === 'ready',
    retry: async () => {
      try {
        await runStartup();
      } catch (error) {
        const appError = toAppError(error);
        setErrorMessage(appError.userMessage);
        setStatus('failed');
      }
    },
    status,
  };
};
