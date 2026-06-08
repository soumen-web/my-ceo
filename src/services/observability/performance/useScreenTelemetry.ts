import { useEffect, useRef } from 'react';

import { analyticsService } from '@services/observability/analytics/analyticsService';
import { performanceMonitor } from '@services/observability/performance/performanceMonitor';

import type { ObservabilityEventDefinition } from '@services/observability/events';

const getCurrentTime = () => globalThis.performance?.now?.() ?? Date.now();

export const useScreenTelemetry = (
  screenName: string,
  screenEvent: ObservabilityEventDefinition,
): void => {
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    const now = getCurrentTime();
    const startedAt = startedAtRef.current ?? now;
    const durationMs = Math.round(
      now - startedAt,
    );

    analyticsService.track(screenEvent, {
      screenName,
    });
    performanceMonitor.recordScreenLoad(screenName, durationMs);

    return () => {
      startedAtRef.current = getCurrentTime();
    };
  }, [screenEvent, screenName]);
};
