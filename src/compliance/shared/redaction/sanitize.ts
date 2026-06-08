import { complianceRuntime } from '@compliance/core/runtime/complianceRuntime';
import type { ResolvedCompliancePolicies } from '@compliance/core/types/policies';
import {
  applyMaskingStrategy,
  resolveDefaultMaskingStrategy,
} from '@compliance/shared/masking/mask';
import {
  collectPayloadClassifications,
  looksLikeCardNumber,
  resolveClassification,
  type DataClassification,
  type FieldClassificationMap,
} from '@compliance/shared/utils/classifyData';
import { transformStructuredValue } from '@compliance/shared/utils/objectTraversal';

interface SanitizeOptions {
  metadata?: FieldClassificationMap | undefined;
  policies?: ResolvedCompliancePolicies | undefined;
}

const normalizeLeafKey = (path: string): string => path.split('.').at(-1) ?? path;

const shouldRedactByPolicy = (
  classification: DataClassification,
  path: string,
  policies: ResolvedCompliancePolicies,
): boolean =>
  policies.logging.redactClassifications.includes(classification) ||
  policies.logging.redactKeys.includes(normalizeLeafKey(path)) ||
  (policies.payment.forbidRawCardLogging &&
    policies.payment.blockedFieldNames.includes(normalizeLeafKey(path)));

const sanitizeValue = (
  value: unknown,
  path: string,
  options: SanitizeOptions,
  mode: 'display' | 'logging' | 'telemetry',
): unknown => {
  const policies = options.policies ?? complianceRuntime.getResolvedPolicies();
  const classification = resolveClassification(path, value, options.metadata);

  if (
    typeof value === 'string' &&
    policies.payment.blockRawCardValues &&
    looksLikeCardNumber(value)
  ) {
    if (mode === 'telemetry') {
      return '[SUPPRESSED]';
    }

    return applyMaskingStrategy(value, 'last4');
  }

  if (mode === 'display') {
    if (!policies.masking.maskClassifications.includes(classification)) {
      return value;
    }

    return applyMaskingStrategy(
      value,
      policies.masking.displayStrategies[classification] ??
        resolveDefaultMaskingStrategy(classification),
    );
  }

  if (mode === 'logging' && shouldRedactByPolicy(classification, path, policies)) {
    return applyMaskingStrategy(
      value,
      policies.masking.displayStrategies[classification] ??
        resolveDefaultMaskingStrategy(classification),
    );
  }

  if (mode === 'telemetry') {
    const telemetryBlocked =
      policies.telemetry.blockedClassifications.includes(classification) ||
      policies.telemetry.suppressCrashContextClassifications.includes(classification);

    if (telemetryBlocked || shouldRedactByPolicy(classification, path, policies)) {
      return '[SUPPRESSED]';
    }
  }

  return value;
};

export const sanitizeForLogs = (
  value: unknown,
  metadata?: FieldClassificationMap,
  policies?: ResolvedCompliancePolicies,
): unknown =>
  transformStructuredValue(value, (nestedValue, path) =>
    sanitizeValue(nestedValue, path, { metadata, policies }, 'logging'),
  );

export const sanitizeForTelemetry = (
  value: unknown,
  metadata?: FieldClassificationMap,
  policies?: ResolvedCompliancePolicies,
): unknown =>
  transformStructuredValue(value, (nestedValue, path) =>
    sanitizeValue(nestedValue, path, { metadata, policies }, 'telemetry'),
  );

export const maskForDisplay = (
  value: unknown,
  classification: DataClassification,
  policies?: ResolvedCompliancePolicies,
): unknown =>
  sanitizeValue(
    value,
    classification,
    {
      metadata: {
        [classification]: classification,
      },
      policies,
    },
    'display',
  );

export const scrubPayloadBeforePersist = (
  value: unknown,
  metadata?: FieldClassificationMap,
  policies?: ResolvedCompliancePolicies,
): unknown => {
  const resolvedPolicies = policies ?? complianceRuntime.getResolvedPolicies();

  return transformStructuredValue(value, (nestedValue, path) => {
    const classification = resolveClassification(path, nestedValue, metadata);

    if (
      resolvedPolicies.storage.forbiddenAllStorage.includes(classification) ||
      (typeof nestedValue === 'string' &&
        resolvedPolicies.payment.blockRawCardValues &&
        looksLikeCardNumber(nestedValue))
    ) {
      return undefined;
    }

    return nestedValue;
  });
};

export const scrubPayloadBeforeNetwork = (
  value: unknown,
  metadata?: FieldClassificationMap,
  policies?: ResolvedCompliancePolicies,
): unknown => {
  const resolvedPolicies = policies ?? complianceRuntime.getResolvedPolicies();

  return transformStructuredValue(value, (nestedValue, path) => {
    const classification = resolveClassification(path, nestedValue, metadata);
    const isBlockedPaymentField =
      resolvedPolicies.payment.blockedFieldNames.includes(normalizeLeafKey(path)) &&
      classification === 'PAYMENT_SENSITIVE';

    if (
      isBlockedPaymentField ||
      (typeof nestedValue === 'string' &&
        resolvedPolicies.payment.blockRawCardValues &&
        looksLikeCardNumber(nestedValue))
    ) {
      return undefined;
    }

    return nestedValue;
  });
};

export const resolveTelemetryClassifications = (
  value: unknown,
  metadata?: FieldClassificationMap,
): DataClassification[] =>
  Array.from(new Set(collectPayloadClassifications(value, metadata)));
