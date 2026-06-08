import { defaultCompliancePolicies } from './defaultPolicies';

import type {
  PartialCompliancePolicies,
  ResolvedCompliancePolicies,
} from '@compliance/core/types/policies';
import type { DataClassification } from '@compliance/shared/utils/classifyData';

const mergeUnique = <T>(current: T[], incoming: T[] | undefined): T[] =>
  Array.from(new Set([...(current ?? []), ...(incoming ?? [])]));

const mergeRetentionDays = (
  current: Partial<Record<DataClassification, number>>,
  incoming: Partial<Record<DataClassification, number>> | undefined,
): Partial<Record<DataClassification, number>> => {
  if (!incoming) {
    return current;
  }

  const keys = new Set<DataClassification>([
    ...Object.keys(current),
    ...Object.keys(incoming),
  ] as DataClassification[]);

  return Array.from(keys).reduce<Partial<Record<DataClassification, number>>>(
    (accumulator, key) => {
      const currentValue = current[key];
      const incomingValue = incoming[key];
      const nextValue =
        currentValue !== undefined && incomingValue !== undefined
          ? Math.min(currentValue, incomingValue)
          : currentValue ?? incomingValue;

      if (nextValue !== undefined) {
        accumulator[key] = nextValue;
      }

      return accumulator;
    },
    {},
  );
};

export const mergeCompliancePolicies = (
  partialPolicies: PartialCompliancePolicies[],
): ResolvedCompliancePolicies =>
  partialPolicies.reduce<ResolvedCompliancePolicies>(
    (resolvedPolicies, partialPolicy) => ({
      access: {
        exportRestrictedClassifications: mergeUnique(
          resolvedPolicies.access.exportRestrictedClassifications,
          partialPolicy.access?.exportRestrictedClassifications,
        ),
        requireAuthenticationForSensitiveData:
          resolvedPolicies.access.requireAuthenticationForSensitiveData ||
          partialPolicy.access?.requireAuthenticationForSensitiveData === true,
        restrictedEditClassifications: mergeUnique(
          resolvedPolicies.access.restrictedEditClassifications,
          partialPolicy.access?.restrictedEditClassifications,
        ),
        restrictedViewClassifications: mergeUnique(
          resolvedPolicies.access.restrictedViewClassifications,
          partialPolicy.access?.restrictedViewClassifications,
        ),
      },
      audit: {
        auditableActions: mergeUnique(
          resolvedPolicies.audit.auditableActions,
          partialPolicy.audit?.auditableActions,
        ),
        auditRestrictedActions:
          resolvedPolicies.audit.auditRestrictedActions ||
          partialPolicy.audit?.auditRestrictedActions === true,
        requiredCapabilityForSensitiveAudit:
          partialPolicy.audit?.requiredCapabilityForSensitiveAudit ??
          resolvedPolicies.audit.requiredCapabilityForSensitiveAudit,
      },
      consent: {
        requiredCategories: mergeUnique(
          resolvedPolicies.consent.requiredCategories,
          partialPolicy.consent?.requiredCategories,
        ),
        requiresPrivacyNotice:
          resolvedPolicies.consent.requiresPrivacyNotice ||
          partialPolicy.consent?.requiresPrivacyNotice === true,
        supportedRegions: mergeUnique(
          resolvedPolicies.consent.supportedRegions,
          partialPolicy.consent?.supportedRegions,
        ),
      },
      logging: {
        redactClassifications: mergeUnique(
          resolvedPolicies.logging.redactClassifications,
          partialPolicy.logging?.redactClassifications,
        ),
        redactKeys: mergeUnique(
          resolvedPolicies.logging.redactKeys,
          partialPolicy.logging?.redactKeys,
        ),
        suppressConsoleLogsInProduction:
          resolvedPolicies.logging.suppressConsoleLogsInProduction ||
          partialPolicy.logging?.suppressConsoleLogsInProduction === true,
      },
      masking: {
        displayStrategies: {
          ...resolvedPolicies.masking.displayStrategies,
          ...partialPolicy.masking?.displayStrategies,
        },
        maskClassifications: mergeUnique(
          resolvedPolicies.masking.maskClassifications,
          partialPolicy.masking?.maskClassifications,
        ),
      },
      notices: mergeUnique(resolvedPolicies.notices, partialPolicy.notices),
      payment: {
        blockedFieldNames: mergeUnique(
          resolvedPolicies.payment.blockedFieldNames,
          partialPolicy.payment?.blockedFieldNames,
        ),
        blockRawCardValues:
          resolvedPolicies.payment.blockRawCardValues ||
          partialPolicy.payment?.blockRawCardValues === true,
        forbidRawCardLogging:
          resolvedPolicies.payment.forbidRawCardLogging ||
          partialPolicy.payment?.forbidRawCardLogging === true,
        requireTokenizedPayments:
          resolvedPolicies.payment.requireTokenizedPayments ||
          partialPolicy.payment?.requireTokenizedPayments === true,
      },
      retention: {
        defaultRetentionDays: mergeRetentionDays(
          resolvedPolicies.retention.defaultRetentionDays,
          partialPolicy.retention?.defaultRetentionDays,
        ),
        supportsCorrectionRequest:
          resolvedPolicies.retention.supportsCorrectionRequest ||
          partialPolicy.retention?.supportsCorrectionRequest === true,
        supportsDeleteRequest:
          resolvedPolicies.retention.supportsDeleteRequest ||
          partialPolicy.retention?.supportsDeleteRequest === true,
        supportsExportRequest:
          resolvedPolicies.retention.supportsExportRequest ||
          partialPolicy.retention?.supportsExportRequest === true,
      },
      storage: {
        auditOnReadClassifications: mergeUnique(
          resolvedPolicies.storage.auditOnReadClassifications,
          partialPolicy.storage?.auditOnReadClassifications,
        ),
        auditOnWriteClassifications: mergeUnique(
          resolvedPolicies.storage.auditOnWriteClassifications,
          partialPolicy.storage?.auditOnWriteClassifications,
        ),
        forbiddenAllStorage: mergeUnique(
          resolvedPolicies.storage.forbiddenAllStorage,
          partialPolicy.storage?.forbiddenAllStorage,
        ),
        forbiddenDeviceStorage: mergeUnique(
          resolvedPolicies.storage.forbiddenDeviceStorage,
          partialPolicy.storage?.forbiddenDeviceStorage,
        ),
        secureStoreOnly: mergeUnique(
          resolvedPolicies.storage.secureStoreOnly,
          partialPolicy.storage?.secureStoreOnly,
        ),
      },
      telemetry: {
        blockedClassifications: mergeUnique(
          resolvedPolicies.telemetry.blockedClassifications,
          partialPolicy.telemetry?.blockedClassifications,
        ),
        requiredConsentCategories: mergeUnique(
          resolvedPolicies.telemetry.requiredConsentCategories,
          partialPolicy.telemetry?.requiredConsentCategories,
        ),
        suppressCrashContextClassifications: mergeUnique(
          resolvedPolicies.telemetry.suppressCrashContextClassifications,
          partialPolicy.telemetry?.suppressCrashContextClassifications,
        ),
      },
    }),
    defaultCompliancePolicies,
  );
