import { runtimeConfig } from '@config/runtime-config';
import { analyticsService } from '@services/observability/analytics/analyticsService';
import { observabilityEvents } from '@services/observability/events';
import { logger } from '@services/observability/logger/logger';

interface PerformanceTraceHandle {
  end: (metadata?: Record<string, unknown>) => number;
}

const getNow = (): number =>
  globalThis.performance?.now?.() ?? Date.now();

const logBudgetResult = (
  name: string,
  durationMs: number,
  budgetMs: number | undefined,
  metadata?: Record<string, unknown>,
): void => {
  if (budgetMs && durationMs > budgetMs) {
    logger.warn(`Performance budget exceeded: ${name}`, {
      budgetMs,
      durationMs,
      ...metadata,
    });
  }
};

export const performanceMonitor = {
  recordApiLatency(
    operation: string,
    durationMs: number,
    metadata?: Record<string, unknown>,
  ): void {
    if (!runtimeConfig.observability.capturePerformance) {
      return;
    }

    logBudgetResult(
      operation,
      durationMs,
      runtimeConfig.performance.budgets.apiLatencyMs,
      metadata,
    );
    analyticsService.track(observabilityEvents.performanceApiLatencyMeasured, {
      durationMs,
      operation,
      ...metadata,
    });
  },
  recordInteraction(
    interactionName: string,
    durationMs = 0,
    metadata?: Record<string, unknown>,
  ): void {
    if (!runtimeConfig.observability.capturePerformance) {
      return;
    }

    logBudgetResult(
      interactionName,
      durationMs,
      runtimeConfig.performance.budgets.interactionMs,
      metadata,
    );
    analyticsService.track(observabilityEvents.performanceInteractionMeasured, {
      durationMs,
      interactionName,
      ...metadata,
    });
  },
  recordScreenLoad(
    screenName: string,
    durationMs: number,
    metadata?: Record<string, unknown>,
  ): void {
    if (!runtimeConfig.observability.capturePerformance) {
      return;
    }

    logBudgetResult(
      screenName,
      durationMs,
      runtimeConfig.performance.budgets.screenLoadMs,
      metadata,
    );
    analyticsService.track(observabilityEvents.performanceScreenLoadMeasured, {
      durationMs,
      screenName,
      ...metadata,
    });
  },
  startTrace(
    name: string,
    budgetMs = runtimeConfig.performance.budgets.bootstrapMs,
  ): PerformanceTraceHandle {
    const startedAt = getNow();

    return {
      end: (metadata) => {
        const durationMs = Math.round(getNow() - startedAt);

        logBudgetResult(name, durationMs, budgetMs, metadata);
        analyticsService.track(observabilityEvents.performanceBootstrapMeasured, {
          durationMs,
          traceName: name,
          ...metadata,
        });

        return durationMs;
      },
    };
  },
};
