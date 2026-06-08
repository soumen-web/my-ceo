import type { ComplianceModuleDefinition } from '@compliance/core/registry/complianceModuleRegistry';

export const PCI_NOTICE =
  'PCI scope-minimising controls are enabled. Raw PAN and CVV values must not be stored locally or sent through unmanaged flows; tokenized payment patterns are required.';

const blockedFieldNames = [
  'cardNumber',
  'cvv',
  'expirationMonth',
  'expirationYear',
  'pan',
  'securityCode',
] as const;

export const pciModuleDefinition: ComplianceModuleDefinition = {
  buildPolicies: () => ({
    audit: {
      auditableActions: [
        'payment_action_started',
        'compliance_restricted_action_blocked',
      ],
    },
    logging: {
      redactClassifications: ['PAYMENT_SENSITIVE'],
      redactKeys: [...blockedFieldNames],
    },
    masking: {
      displayStrategies: {
        PAYMENT_SENSITIVE: 'last4',
      },
      maskClassifications: ['PAYMENT_SENSITIVE'],
    },
    notices: [PCI_NOTICE],
    payment: {
      blockedFieldNames: [...blockedFieldNames],
      blockRawCardValues: true,
      forbidRawCardLogging: true,
      requireTokenizedPayments: true,
    },
    storage: {
      auditOnWriteClassifications: ['PAYMENT_SENSITIVE'],
      forbiddenAllStorage: ['PAYMENT_SENSITIVE'],
      forbiddenDeviceStorage: ['PAYMENT_SENSITIVE'],
    },
    telemetry: {
      blockedClassifications: ['PAYMENT_SENSITIVE'],
      suppressCrashContextClassifications: ['PAYMENT_SENSITIVE'],
    },
  }),
  enrichAuditEvent: (event) =>
    event.classification === 'PAYMENT_SENSITIVE'
      ? {
          ...event,
          details: {
            ...event.details,
            pciScopeMinimized: true,
          },
        }
      : event,
  id: 'PCI',
  priority: 300,
};
