import type { MaskingStrategy } from '@compliance/core/types/policies';
import type { DataClassification } from '@compliance/shared/utils/classifyData';

const FULL_MASK = '[REDACTED]';

const maskEmail = (value: string): string => {
  const [localPart = '', domain = ''] = value.split('@');

  if (!domain) {
    return FULL_MASK;
  }

  const visiblePrefix = localPart.slice(0, 2);
  return `${visiblePrefix}${'*'.repeat(Math.max(0, localPart.length - 2))}@${domain}`;
};

const maskLastFour = (value: string): string => {
  const digits = value.replace(/\D/g, '');

  if (digits.length <= 4) {
    return FULL_MASK;
  }

  return `**** **** **** ${digits.slice(-4)}`;
};

const maskPartial = (value: string): string => {
  if (value.length <= 4) {
    return FULL_MASK;
  }

  return `${value.slice(0, 2)}${'*'.repeat(Math.max(2, value.length - 4))}${value.slice(-2)}`;
};

export const applyMaskingStrategy = (
  value: unknown,
  strategy: MaskingStrategy,
): unknown => {
  if (typeof value !== 'string') {
    return FULL_MASK;
  }

  if (strategy === 'email') {
    return maskEmail(value);
  }

  if (strategy === 'last4') {
    return maskLastFour(value);
  }

  if (strategy === 'partial') {
    return maskPartial(value);
  }

  return FULL_MASK;
};

export const resolveDefaultMaskingStrategy = (
  classification: DataClassification,
): MaskingStrategy =>
  classification === 'PAYMENT_SENSITIVE'
    ? 'last4'
    : classification === 'PII'
      ? 'partial'
      : classification === 'CREDENTIAL_SECRET'
        ? 'full'
        : 'full';
