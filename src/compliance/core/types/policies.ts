import type { AppCapability } from '@services/access-control/types';

import type { ConsentCategory } from './consent';
import type { ComplianceAuditAction } from './audit';
import type { DataClassification } from '@compliance/shared/utils/classifyData';

export type MaskingStrategy = 'email' | 'full' | 'last4' | 'partial';

export interface StoragePolicy {
  auditOnReadClassifications: DataClassification[];
  auditOnWriteClassifications: DataClassification[];
  forbiddenAllStorage: DataClassification[];
  forbiddenDeviceStorage: DataClassification[];
  secureStoreOnly: DataClassification[];
}

export interface LoggingPolicy {
  redactClassifications: DataClassification[];
  redactKeys: string[];
  suppressConsoleLogsInProduction: boolean;
}

export interface MaskingPolicy {
  displayStrategies: Partial<Record<DataClassification, MaskingStrategy>>;
  maskClassifications: DataClassification[];
}

export interface ConsentPolicy {
  requiredCategories: ConsentCategory[];
  requiresPrivacyNotice: boolean;
  supportedRegions: string[];
}

export interface AuditPolicy {
  auditableActions: ComplianceAuditAction[];
  auditRestrictedActions: boolean;
  requiredCapabilityForSensitiveAudit?: AppCapability | undefined;
}

export interface RetentionPolicy {
  defaultRetentionDays: Partial<Record<DataClassification, number>>;
  supportsCorrectionRequest: boolean;
  supportsDeleteRequest: boolean;
  supportsExportRequest: boolean;
}

export interface AccessPolicy {
  exportRestrictedClassifications: DataClassification[];
  requireAuthenticationForSensitiveData: boolean;
  restrictedEditClassifications: DataClassification[];
  restrictedViewClassifications: DataClassification[];
}

export interface PaymentPolicy {
  blockedFieldNames: string[];
  blockRawCardValues: boolean;
  forbidRawCardLogging: boolean;
  requireTokenizedPayments: boolean;
}

export interface TelemetryPolicy {
  blockedClassifications: DataClassification[];
  requiredConsentCategories: ConsentCategory[];
  suppressCrashContextClassifications: DataClassification[];
}

export interface ResolvedCompliancePolicies {
  access: AccessPolicy;
  audit: AuditPolicy;
  consent: ConsentPolicy;
  logging: LoggingPolicy;
  masking: MaskingPolicy;
  notices: string[];
  payment: PaymentPolicy;
  retention: RetentionPolicy;
  storage: StoragePolicy;
  telemetry: TelemetryPolicy;
}

export interface PartialCompliancePolicies {
  access?: Partial<AccessPolicy>;
  audit?: Partial<AuditPolicy>;
  consent?: Partial<ConsentPolicy>;
  logging?: Partial<LoggingPolicy>;
  masking?: Partial<MaskingPolicy>;
  notices?: string[];
  payment?: Partial<PaymentPolicy>;
  retention?: Partial<RetentionPolicy>;
  storage?: Partial<StoragePolicy>;
  telemetry?: Partial<TelemetryPolicy>;
}
