import { featureFlagService } from '@config/feature-flags/featureFlagService';
import { runtimeConfig } from '@config/runtime-config';
import { complianceRuntime } from '@compliance/core/runtime/complianceRuntime';
import { createComplianceSafeTelemetryPayload } from '@compliance/shared/telemetry/telemetry';
import { logger } from '@services/observability/logger/logger';
import { isRecord } from '@shared/utils/isRecord';

import type { ObservabilityEventDefinition } from '@services/observability/events';

export const analyticsService = {
  track(
    event: ObservabilityEventDefinition,
    properties?: Record<string, unknown>,
  ) {
    const telemetryPayload = createComplianceSafeTelemetryPayload(properties);

    if (
      runtimeConfig.observability.analyticsMode === 'disabled' ||
      !featureFlagService.isEnabled('enableObservability') ||
      !complianceRuntime.getPolicyGateway().canSendTelemetry({
        classifications: telemetryPayload.classifications,
      })
    ) {
      return;
    }

    logger.info(`Observability event: ${event.name}`, {
      category: event.category,
      ...(isRecord(telemetryPayload.payload) ? telemetryPayload.payload : {}),
    });
  },
};
