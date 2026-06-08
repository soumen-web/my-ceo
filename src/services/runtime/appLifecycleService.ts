import { AppState, type AppStateStatus } from 'react-native';

import { analyticsService } from '@services/observability/analytics/analyticsService';
import { performanceMonitor } from '@services/observability/performance/performanceMonitor';
import { observabilityEvents } from '@services/observability/events';

let activeAppState: AppStateStatus = AppState.currentState;
let removeSubscription: (() => void) | null = null;

export const appLifecycleService = {
  dispose(): void {
    removeSubscription?.();
    removeSubscription = null;
  },
  initialize(): void {
    if (removeSubscription) {
      return;
    }

    const subscription = AppState.addEventListener('change', (nextState) => {
      analyticsService.track(observabilityEvents.runtimeAppStateChanged, {
        from: activeAppState,
        to: nextState,
      });

      if (nextState === 'active') {
        performanceMonitor.recordInteraction('app_resumed');
      }

      activeAppState = nextState;
    });

    removeSubscription = () => {
      subscription.remove();
    };
  },
};
