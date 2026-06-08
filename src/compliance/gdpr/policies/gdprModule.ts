import type { ComplianceModuleDefinition } from '@compliance/core/registry/complianceModuleRegistry';

export const GDPR_NOTICE =
  'GDPR-aligned controls are enabled. Keep retention metadata explicit, gate telemetry through consent where required, and support export, correction, and deletion request workflows.';

const supportedRegions = [
  'AT',
  'BE',
  'DE',
  'DK',
  'EE',
  'ES',
  'EU',
  'FI',
  'FR',
  'IE',
  'IT',
  'NL',
  'NO',
  'PL',
  'PT',
  'SE',
];

export const gdprModuleDefinition: ComplianceModuleDefinition = {
  buildPolicies: () => ({
    access: {
      exportRestrictedClassifications: ['PII'],
      requireAuthenticationForSensitiveData: true,
      restrictedEditClassifications: ['PII'],
      restrictedViewClassifications: ['PII'],
    },
    audit: {
      auditableActions: [
        'deletion_request_initiated',
        'export_request_initiated',
        'correction_request_initiated',
      ],
    },
    consent: {
      requiredCategories: ['analytics'],
      requiresPrivacyNotice: true,
      supportedRegions,
    },
    logging: {
      redactClassifications: ['PII'],
      redactKeys: ['email', 'firstName', 'fullName', 'lastName', 'phone'],
    },
    masking: {
      displayStrategies: {
        PII: 'partial',
      },
      maskClassifications: ['PII'],
    },
    notices: [GDPR_NOTICE],
    retention: {
      defaultRetentionDays: {
        PII: 365,
        REGULATED_METADATA: 365,
      },
      supportsCorrectionRequest: true,
      supportsDeleteRequest: true,
      supportsExportRequest: true,
    },
    telemetry: {
      blockedClassifications: ['PII'],
      requiredConsentCategories: ['analytics'],
      suppressCrashContextClassifications: ['PII'],
    },
  }),
  enrichAuditEvent: (event) => ({
    ...event,
    details: {
      ...event.details,
      gdprAware: true,
    },
  }),
  id: 'GDPR',
  priority: 100,
};
