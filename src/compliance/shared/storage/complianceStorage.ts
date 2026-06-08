import { auditService } from '@compliance/core/audit/auditService';
import { CompliancePolicyError } from '@compliance/core/errors/CompliancePolicyError';
import { complianceRuntime } from '@compliance/core/runtime/complianceRuntime';
import { scrubPayloadBeforePersist } from '@compliance/shared/redaction/sanitize';
import type {
  DataClassification,
  FieldClassificationMap,
} from '@compliance/shared/utils/classifyData';
import { deviceStorage } from '@/services/storage/deviceStorage';
import { sensitiveStorage } from '@/services/storage/sensitiveStorage';

type StorageTarget = 'auto' | 'device' | 'secure';

interface StoredEnvelope<TValue> {
  expiresAt?: string | undefined;
  value: TValue;
}

export interface ComplianceStorageWriteRequest<TValue> {
  auditLabel?: string;
  classification: DataClassification;
  expiresAt?: string;
  key: string;
  metadata?: FieldClassificationMap;
  target?: StorageTarget;
  value: TValue;
}

export interface ComplianceStorageReadRequest {
  auditLabel?: string;
  classification: DataClassification;
  key: string;
  target?: Exclude<StorageTarget, 'auto'>;
}

const resolveTarget = (
  target: StorageTarget,
  classification: DataClassification,
): Exclude<StorageTarget, 'auto'> => {
  if (target !== 'auto') {
    return target;
  }

  const policies = complianceRuntime.getResolvedPolicies();

  if (policies.storage.secureStoreOnly.includes(classification)) {
    return 'secure';
  }

  return 'device';
};

const serializeEnvelope = <TValue>(
  value: TValue,
  expiresAt?: string,
): string =>
  JSON.stringify({
    ...(expiresAt ? { expiresAt } : {}),
    value,
  } satisfies StoredEnvelope<TValue>);

const parseEnvelope = <TValue>(rawValue: string | null): StoredEnvelope<TValue> | null => {
  if (!rawValue) {
    return null;
  }

  return JSON.parse(rawValue) as StoredEnvelope<TValue>;
};

export const complianceStorage = {
  async read<TValue>({
    auditLabel,
    classification,
    key,
    target = 'device',
  }: ComplianceStorageReadRequest): Promise<TValue | null> {
    const rawValue =
      target === 'secure'
        ? await sensitiveStorage.getItem(key)
        : ((await deviceStorage.getItem<string>(key)) as string | null);

    const parsedEnvelope = parseEnvelope<TValue>(rawValue);

    if (!parsedEnvelope) {
      return null;
    }

    if (
      parsedEnvelope.expiresAt &&
      new Date(parsedEnvelope.expiresAt).getTime() <= Date.now()
    ) {
      await this.remove(key, target);
      return null;
    }

    if (
      complianceRuntime
        .getResolvedPolicies()
        .storage.auditOnReadClassifications.includes(classification)
    ) {
      void auditService.record({
        action: 'sensitive_storage_accessed',
        classification,
        details: {
          key,
          label: auditLabel,
        },
        moduleIds: complianceRuntime.getActiveModuleIds(),
        outcome: 'recorded',
        resource: key,
        timestamp: new Date().toISOString(),
      });
    }

    return parsedEnvelope.value;
  },
  async remove(
    key: string,
    target: Exclude<StorageTarget, 'auto'>,
  ): Promise<void> {
    if (target === 'secure') {
      await sensitiveStorage.removeItem(key);
      return;
    }

    await deviceStorage.removeItem(key);
  },
  async write<TValue>({
    auditLabel,
    classification,
    expiresAt,
    key,
    metadata,
    target = 'auto',
    value,
  }: ComplianceStorageWriteRequest<TValue>): Promise<void> {
    const resolvedTarget = resolveTarget(target, classification);

    if (
      !complianceRuntime
        .getPolicyGateway()
        .canStoreLocally({ classification, target: resolvedTarget, value })
    ) {
      void auditService.record({
        action: 'compliance_restricted_action_blocked',
        classification,
        details: {
          key,
          label: auditLabel,
          target: resolvedTarget,
        },
        moduleIds: complianceRuntime.getActiveModuleIds(),
        outcome: 'blocked',
        resource: key,
        timestamp: new Date().toISOString(),
      });
      throw new CompliancePolicyError(
        `Local storage is blocked for ${classification} values.`,
        'LOCAL_STORAGE_BLOCKED',
      );
    }

    const scrubbedValue =
      resolvedTarget === 'device'
        ? (scrubPayloadBeforePersist(
            value,
            metadata,
            complianceRuntime.getResolvedPolicies(),
          ) as TValue)
        : value;

    const serializedValue = serializeEnvelope(scrubbedValue, expiresAt);

    if (resolvedTarget === 'secure') {
      await sensitiveStorage.setItem(key, serializedValue);
    } else {
      await deviceStorage.setItem(key, serializedValue);
    }

    if (
      complianceRuntime
        .getResolvedPolicies()
        .storage.auditOnWriteClassifications.includes(classification)
    ) {
      void auditService.record({
        action: 'sensitive_storage_accessed',
        classification,
        details: {
          key,
          label: auditLabel,
          target: resolvedTarget,
        },
        moduleIds: complianceRuntime.getActiveModuleIds(),
        outcome: 'recorded',
        resource: key,
        timestamp: new Date().toISOString(),
      });
    }
  },
};
