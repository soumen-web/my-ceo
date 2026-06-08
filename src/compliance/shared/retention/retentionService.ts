import type { ComplianceAuditAction } from '@compliance/core/types/audit';
import type { DataClassification } from '@compliance/shared/utils/classifyData';

export interface RetentionRequest {
  actorId?: string | undefined;
  classification: DataClassification;
  recordId: string;
  requestedAt: string;
  tenantId?: string | undefined;
  type: Extract<
    ComplianceAuditAction,
    | 'correction_request_initiated'
    | 'deletion_request_initiated'
    | 'export_request_initiated'
  >;
}

export const retentionService = {
  buildCorrectionRequest(
    recordId: string,
    classification: DataClassification,
    actorId?: string,
  ): RetentionRequest {
    return {
      ...(actorId ? { actorId } : {}),
      classification,
      recordId,
      requestedAt: new Date().toISOString(),
      type: 'correction_request_initiated',
    };
  },
  buildDeletionRequest(
    recordId: string,
    classification: DataClassification,
    actorId?: string,
  ): RetentionRequest {
    return {
      ...(actorId ? { actorId } : {}),
      classification,
      recordId,
      requestedAt: new Date().toISOString(),
      type: 'deletion_request_initiated',
    };
  },
  buildExportRequest(
    recordId: string,
    classification: DataClassification,
    actorId?: string,
  ): RetentionRequest {
    return {
      ...(actorId ? { actorId } : {}),
      classification,
      recordId,
      requestedAt: new Date().toISOString(),
      type: 'export_request_initiated',
    };
  },
  isRetentionExpired(
    createdAt: string,
    retentionDays: number | undefined,
    now = new Date(),
  ): boolean {
    if (!retentionDays) {
      return false;
    }

    const createdTimestamp = new Date(createdAt).getTime();
    const expiryTimestamp =
      createdTimestamp + retentionDays * 24 * 60 * 60 * 1000;

    return now.getTime() >= expiryTimestamp;
  },
};
