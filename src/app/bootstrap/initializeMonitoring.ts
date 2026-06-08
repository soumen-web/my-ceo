import { crashReportingService } from '@/services/observability/crash-reporting/crashReportingService';

export const initializeMonitoring = (): void => {
  crashReportingService.initialize();
};
