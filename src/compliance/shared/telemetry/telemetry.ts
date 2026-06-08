import type { FieldClassificationMap } from '@compliance/shared/utils/classifyData';

import { resolveTelemetryClassifications, sanitizeForTelemetry } from '../redaction/sanitize';

export const createComplianceSafeTelemetryPayload = (
  payload: unknown,
  metadata?: FieldClassificationMap,
) => ({
  classifications: resolveTelemetryClassifications(payload, metadata),
  payload: sanitizeForTelemetry(payload, metadata),
});
