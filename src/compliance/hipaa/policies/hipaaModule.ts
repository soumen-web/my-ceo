import type { ComplianceModuleDefinition } from '@compliance/core/registry/complianceModuleRegistry';

export const HIPAA_NOTICE =
  'HIPAA-ready technical controls are enabled. Treat health and identity data as sensitive, keep PHI out of logs and non-secure storage, and audit sensitive access.';

export const hipaaModuleDefinition: ComplianceModuleDefinition = {
  buildPolicies: () => ({
    access: {
      requireAuthenticationForSensitiveData: true,
      restrictedEditClassifications: ['PHI'],
      restrictedViewClassifications: ['PHI'],
    },
    audit: {
      auditableActions: [
        'sensitive_record_viewed',
        'sensitive_record_edited',
        'sensitive_storage_accessed',
      ],
    },
    logging: {
      redactClassifications: ['PHI', 'PII'],
      redactKeys: ['diagnosis', 'medicalRecordNumber', 'patientId'],
    },
    masking: {
      displayStrategies: {
        PHI: 'full',
      },
      maskClassifications: ['PHI'],
    },
    notices: [HIPAA_NOTICE],
    storage: {
      auditOnReadClassifications: ['PHI'],
      auditOnWriteClassifications: ['PHI'],
      forbiddenDeviceStorage: ['PHI'],
      secureStoreOnly: ['PHI', 'REGULATED_METADATA'],
    },
    telemetry: {
      blockedClassifications: ['PHI'],
      suppressCrashContextClassifications: ['PHI'],
    },
  }),
  enrichAuditEvent: (event) =>
    event.classification === 'PHI'
      ? {
          ...event,
          details: {
            ...event.details,
            hipaaControl: 'sensitive-health-data-access',
          },
        }
      : event,
  id: 'HIPAA',
  priority: 200,
};
