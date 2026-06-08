import type { DataClassification } from '@compliance/shared/utils/classifyData';

import type { ComplianceModuleId } from './modules';

export const COMPLIANCE_AUDIT_ACTIONS = [
  'sensitive_record_viewed',
  'sensitive_record_edited',
  'deletion_request_initiated',
  'export_request_initiated',
  'correction_request_initiated',
  'payment_action_started',
  'compliance_restricted_action_blocked',
  'sensitive_storage_accessed',
  'consent_updated',
] as const;

export type ComplianceAuditAction = (typeof COMPLIANCE_AUDIT_ACTIONS)[number];

export interface ComplianceAuditEvent {
  action: ComplianceAuditAction;
  actorId?: string | undefined;
  classification?: DataClassification | undefined;
  details?: Record<string, unknown> | undefined;
  moduleIds: ComplianceModuleId[];
  outcome: 'allowed' | 'blocked' | 'recorded';
  resource?: string | undefined;
  tenantId?: string | undefined;
  timestamp: string;
}

export interface ComplianceAuditSink {
  write(event: ComplianceAuditEvent): Promise<void> | void;
}
