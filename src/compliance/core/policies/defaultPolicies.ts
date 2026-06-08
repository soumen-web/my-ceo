import type { ResolvedCompliancePolicies } from '@compliance/core/types/policies';

export const defaultCompliancePolicies: ResolvedCompliancePolicies = {
  access: {
    exportRestrictedClassifications: [],
    requireAuthenticationForSensitiveData: false,
    restrictedEditClassifications: ['CREDENTIAL_SECRET'],
    restrictedViewClassifications: ['CREDENTIAL_SECRET'],
  },
  audit: {
    auditRestrictedActions: true,
    auditableActions: ['compliance_restricted_action_blocked'],
  },
  consent: {
    requiredCategories: [],
    requiresPrivacyNotice: false,
    supportedRegions: [],
  },
  logging: {
    redactClassifications: ['CREDENTIAL_SECRET'],
    redactKeys: [
      'accessToken',
      'authorization',
      'password',
      'refreshToken',
      'secret',
      'token',
    ],
    suppressConsoleLogsInProduction: true,
  },
  masking: {
    displayStrategies: {
      CREDENTIAL_SECRET: 'full',
    },
    maskClassifications: ['CREDENTIAL_SECRET'],
  },
  notices: [],
  payment: {
    blockedFieldNames: [],
    blockRawCardValues: false,
    forbidRawCardLogging: false,
    requireTokenizedPayments: false,
  },
  retention: {
    defaultRetentionDays: {},
    supportsCorrectionRequest: false,
    supportsDeleteRequest: false,
    supportsExportRequest: false,
  },
  storage: {
    auditOnReadClassifications: [],
    auditOnWriteClassifications: ['CREDENTIAL_SECRET'],
    forbiddenAllStorage: [],
    forbiddenDeviceStorage: ['CREDENTIAL_SECRET'],
    secureStoreOnly: ['CREDENTIAL_SECRET'],
  },
  telemetry: {
    blockedClassifications: ['CREDENTIAL_SECRET'],
    requiredConsentCategories: [],
    suppressCrashContextClassifications: ['CREDENTIAL_SECRET'],
  },
};
