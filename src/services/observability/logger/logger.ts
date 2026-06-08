import { crashReportingService } from '@/services/observability/crash-reporting/crashReportingService';
import { sanitizeForLogging } from '@/security/redaction';
import { complianceRuntime } from '@compliance/core/runtime/complianceRuntime';

type LogContext = Record<string, unknown> | undefined;
type LogLevel = 'error' | 'info' | 'warn';

const emitConsoleLog = (
  level: LogLevel,
  message: string,
  context?: LogContext,
): void => {
  const runtimePolicies = complianceRuntime.getResolvedPolicies();

  if (!__DEV__ || runtimePolicies.logging.suppressConsoleLogsInProduction) {
    return;
  }

  const safeContext = sanitizeForLogging(context);

  if (level === 'error') {
    console.error(message, safeContext);
    return;
  }

  if (level === 'warn') {
    console.warn(message, safeContext);
    return;
  }

  console.info(message, safeContext);
};

export const logger = {
  error(error: Error | string, context?: LogContext) {
    const normalizedError = typeof error === 'string' ? new Error(error) : error;
    const safeContext = sanitizeForLogging(context) as
      | Record<string, unknown>
      | undefined;

    emitConsoleLog('error', normalizedError.message, safeContext);
    crashReportingService.captureException(normalizedError, safeContext);
  },
  info(message: string, context?: LogContext) {
    emitConsoleLog('info', message, context);
  },
  warn(message: string, context?: LogContext) {
    emitConsoleLog('warn', message, context);
  },
};
