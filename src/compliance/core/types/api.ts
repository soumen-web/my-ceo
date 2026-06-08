import type { ComplianceAuditAction } from './audit';
import type { FieldClassificationMap } from '@compliance/shared/utils/classifyData';

export interface ComplianceRequestContext {
  auditAction?: ComplianceAuditAction | undefined;
  fieldClassifications?: FieldClassificationMap | undefined;
  operationName?: string | undefined;
  resource?: string | undefined;
}
