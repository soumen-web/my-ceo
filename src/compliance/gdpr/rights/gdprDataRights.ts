import { auditService } from '@compliance/core/audit/auditService';
import { complianceRuntime } from '@compliance/core/runtime/complianceRuntime';
import { retentionService } from '@compliance/shared/retention/retentionService';

import type { DataClassification } from '@compliance/shared/utils/classifyData';

export const gdprDataRights = {
  async initiateCorrectionRequest(
    recordId: string,
    classification: DataClassification,
    actorId?: string,
  ) {
    const request = retentionService.buildCorrectionRequest(
      recordId,
      classification,
      actorId,
    );

    await auditService.record({
      action: request.type,
      actorId,
      classification,
      details: {
        ...request,
      },
      moduleIds: complianceRuntime.getActiveModuleIds(),
      outcome: 'recorded',
      resource: recordId,
      timestamp: request.requestedAt,
    });

    return request;
  },
  async initiateDeletionRequest(
    recordId: string,
    classification: DataClassification,
    actorId?: string,
  ) {
    const request = retentionService.buildDeletionRequest(
      recordId,
      classification,
      actorId,
    );

    await auditService.record({
      action: request.type,
      actorId,
      classification,
      details: {
        ...request,
      },
      moduleIds: complianceRuntime.getActiveModuleIds(),
      outcome: 'recorded',
      resource: recordId,
      timestamp: request.requestedAt,
    });

    return request;
  },
  async initiateExportRequest(
    recordId: string,
    classification: DataClassification,
    actorId?: string,
  ) {
    const request = retentionService.buildExportRequest(
      recordId,
      classification,
      actorId,
    );

    await auditService.record({
      action: request.type,
      actorId,
      classification,
      details: {
        ...request,
      },
      moduleIds: complianceRuntime.getActiveModuleIds(),
      outcome: 'recorded',
      resource: recordId,
      timestamp: request.requestedAt,
    });

    return request;
  },
};
