import { backgroundTaskRegistry } from '@services/background/backgroundTaskRegistry';
import { appLifecycleService } from '@services/runtime/appLifecycleService';

let runtimeWorkflowInitialized = false;

export const runtimeWorkflowService = {
  dispose(): void {
    appLifecycleService.dispose();
    runtimeWorkflowInitialized = false;
  },
  initialize(): void {
    if (runtimeWorkflowInitialized) {
      return;
    }

    backgroundTaskRegistry.initialize();
    appLifecycleService.initialize();
    runtimeWorkflowInitialized = true;
  },
};
