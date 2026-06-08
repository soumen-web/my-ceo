export const COMPLIANCE_MODULES = ['HIPAA', 'GDPR', 'PCI'] as const;

export type ComplianceModuleId = (typeof COMPLIANCE_MODULES)[number];
