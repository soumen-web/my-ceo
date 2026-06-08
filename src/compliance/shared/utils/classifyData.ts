import { isRecord } from '@shared/utils/isRecord';

export const DATA_CLASSIFICATIONS = [
  'PUBLIC',
  'INTERNAL',
  'PII',
  'PHI',
  'PAYMENT_SENSITIVE',
  'CREDENTIAL_SECRET',
  'REGULATED_METADATA',
] as const;

export type DataClassification = (typeof DATA_CLASSIFICATIONS)[number];
export type FieldClassificationMap = Record<string, DataClassification>;

const fieldClassificationMap: Record<string, DataClassification> = {
  accessToken: 'CREDENTIAL_SECRET',
  address: 'PII',
  authorization: 'CREDENTIAL_SECRET',
  cardNumber: 'PAYMENT_SENSITIVE',
  cvv: 'PAYMENT_SENSITIVE',
  dateOfBirth: 'PII',
  diagnosis: 'PHI',
  dob: 'PII',
  email: 'PII',
  expirationMonth: 'PAYMENT_SENSITIVE',
  expirationYear: 'PAYMENT_SENSITIVE',
  firstName: 'PII',
  fullName: 'PII',
  lastName: 'PII',
  medicalRecordNumber: 'PHI',
  password: 'CREDENTIAL_SECRET',
  patientId: 'PHI',
  phone: 'PII',
  refreshToken: 'CREDENTIAL_SECRET',
  routingNumber: 'PAYMENT_SENSITIVE',
  securityCode: 'PAYMENT_SENSITIVE',
  secret: 'CREDENTIAL_SECRET',
  ssn: 'PII',
  token: 'CREDENTIAL_SECRET',
};

const cardFieldPattern =
  /(card(number)?|pan|cvv|securitycode|expiration(month|year)?|routingnumber)/i;
const phiFieldPattern =
  /(medical|patient|diagnosis|treatment|prescription|clinical|health|record)/i;
const piiFieldPattern =
  /(name|email|phone|address|birth|dob|ssn|nationalid|passport)/i;
const secretFieldPattern =
  /(token|secret|password|authorization|credential|apikey|access)/i;

const normalizePathSegment = (path: string): string =>
  path.split('.').at(-1)?.replace(/\[\d+\]/g, '') ?? path;

const extractDigits = (value: string): string => value.replace(/\D/g, '');

const passesLuhnCheck = (digits: string): boolean => {
  let shouldDouble = false;
  let sum = 0;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index] ?? '0');

    if (shouldDouble) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

export const looksLikeCardNumber = (value: string): boolean => {
  const digits = extractDigits(value);

  if (digits.length < 13 || digits.length > 19) {
    return false;
  }

  return passesLuhnCheck(digits);
};

const inferClassificationFromFieldName = (
  fieldName: string,
): DataClassification | undefined => {
  const exactMatch = fieldClassificationMap[fieldName];

  if (exactMatch) {
    return exactMatch;
  }

  if (cardFieldPattern.test(fieldName)) {
    return 'PAYMENT_SENSITIVE';
  }

  if (secretFieldPattern.test(fieldName)) {
    return 'CREDENTIAL_SECRET';
  }

  if (phiFieldPattern.test(fieldName)) {
    return 'PHI';
  }

  if (piiFieldPattern.test(fieldName)) {
    return 'PII';
  }

  return undefined;
};

export const inferClassificationForField = (
  fieldPath: string,
  value?: unknown,
): DataClassification => {
  const normalizedField = normalizePathSegment(fieldPath);
  const inferredByField = inferClassificationFromFieldName(normalizedField);

  if (inferredByField) {
    return inferredByField;
  }

  if (typeof value === 'string' && looksLikeCardNumber(value)) {
    return 'PAYMENT_SENSITIVE';
  }

  return 'INTERNAL';
};

export const resolveClassification = (
  fieldPath: string,
  value: unknown,
  metadata?: FieldClassificationMap,
): DataClassification =>
  metadata?.[fieldPath] ??
  metadata?.[normalizePathSegment(fieldPath)] ??
  inferClassificationForField(fieldPath, value);

export const collectPayloadClassifications = (
  value: unknown,
  metadata?: FieldClassificationMap,
  parentPath = '',
): DataClassification[] => {
  if (Array.isArray(value)) {
    return value.flatMap((nestedValue, index) =>
      collectPayloadClassifications(
        nestedValue,
        metadata,
        parentPath ? `${parentPath}[${index}]` : `[${index}]`,
      ),
    );
  }

  if (isRecord(value)) {
    return Object.entries(value).flatMap(([key, nestedValue]) => {
      const path = parentPath ? `${parentPath}.${key}` : key;
      const directClassification = resolveClassification(path, nestedValue, metadata);

      return [
        directClassification,
        ...collectPayloadClassifications(nestedValue, metadata, path),
      ];
    });
  }

  if (!parentPath) {
    return [];
  }

  return [resolveClassification(parentPath, value, metadata)];
};
