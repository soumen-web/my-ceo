export { GDPR_NOTICE } from '@compliance/gdpr/policies/gdprModule';
export { HIPAA_NOTICE } from '@compliance/hipaa/policies/hipaaModule';
export { PCI_NOTICE } from '@compliance/pci/policies/pciModule';

export const REDACTED_LOG_FIELDS = [
  'accessToken',
  'authorization',
  'cardNumber',
  'cvv',
  'dateOfBirth',
  'diagnosis',
  'dob',
  'email',
  'medicalRecordNumber',
  'password',
  'refreshToken',
  'routingNumber',
  'securityCode',
  'ssn',
  'token',
] as const;
