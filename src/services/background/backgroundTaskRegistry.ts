type BackgroundTaskHandler = () => Promise<void> | void;

const registeredTasks = new Map<string, BackgroundTaskHandler>();
let backgroundRegistryInitialized = false;

export const backgroundTaskRegistry = {
  getRegisteredTaskNames(): string[] {
    return Array.from(registeredTasks.keys());
  },
  initialize(): void {
    if (backgroundRegistryInitialized) {
      return;
    }

    backgroundRegistryInitialized = true;
  },
  register(taskName: string, handler: BackgroundTaskHandler): void {
    registeredTasks.set(taskName, handler);
  },
};
