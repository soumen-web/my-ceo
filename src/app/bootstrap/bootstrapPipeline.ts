import { observabilityEvents } from '@services/observability/events';
import { analyticsService } from '@services/observability/analytics/analyticsService';
import { performanceMonitor } from '@services/observability/performance/performanceMonitor';
import { toAppError } from '@shared/core/errors/AppError';

import type {
  BootstrapContext,
  BootstrapFailure,
  BootstrapPipelineResult,
  BootstrapTask,
} from '@app/bootstrap/types';

export const runBootstrapPipeline = async (
  tasks: BootstrapTask[],
  context: BootstrapContext,
): Promise<BootstrapPipelineResult> => {
  const failures: BootstrapFailure[] = [];
  const trace = performanceMonitor.startTrace('app_bootstrap');

  analyticsService.track(observabilityEvents.runtimeBootstrapStarted, {
    taskCount: tasks.length,
  });

  for (const task of tasks) {
    try {
      await task.execute(context);
    } catch (error) {
      const appError = toAppError(error);

      failures.push({
        error: appError,
        key: task.key,
      });

      if (task.critical !== false) {
        trace.end({
          failureCount: failures.length,
          outcome: 'failed',
        });

        analyticsService.track(observabilityEvents.runtimeBootstrapFailed, {
          failureCount: failures.length,
          taskKey: task.key,
        });

        return {
          failures,
          isReady: false,
        };
      }
    }
  }

  trace.end({
    failureCount: failures.length,
    outcome: 'ready',
  });
  analyticsService.track(observabilityEvents.runtimeBootstrapCompleted, {
    failureCount: failures.length,
  });

  return {
    failures,
    isReady: true,
  };
};
