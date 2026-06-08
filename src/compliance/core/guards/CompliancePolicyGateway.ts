import { accessControlService } from '@/services/access-control/accessControlService';

import type { ConsentState } from '@compliance/core/types/consent';
import type { ComplianceConfig } from '@compliance/core/types/config';
import type { ComplianceEngine } from '@compliance/core/engine/createComplianceEngine';
import type {
  AccessContext,
  AppCapability,
} from '@/services/access-control/types';
import type {
  DataClassification,
  FieldClassificationMap,
} from '@compliance/shared/utils/classifyData';
import {
  collectPayloadClassifications,
  looksLikeCardNumber,
  resolveClassification,
} from '@compliance/shared/utils/classifyData';

interface TelemetryEvaluationInput {
  classifications?: DataClassification[];
  metadata?: FieldClassificationMap;
  payload?: unknown;
}

interface StorageEvaluationInput {
  classification: DataClassification;
  target: 'device' | 'secure';
  value?: unknown;
}

interface GateEvaluationInput {
  classification: DataClassification;
  requiredCapability?: AppCapability | undefined;
}

interface ExportEvaluationInput {
  classifications: DataClassification[];
  requiredCapability?: AppCapability | undefined;
}

interface PaymentEvaluationInput {
  containsRawCardData: boolean;
  requiredCapability?: AppCapability | undefined;
}

interface CompliancePolicyGatewayContext {
  accessContext: AccessContext;
  config: ComplianceConfig;
  consentState: ConsentState;
  engine: ComplianceEngine;
}

const hasRequiredCapability = (
  accessContext: AccessContext,
  requiredCapability: AppCapability | undefined,
): boolean =>
  !requiredCapability ||
  accessControlService.canAccess(accessContext, requiredCapability);

export class CompliancePolicyGateway {
  public constructor(
    private readonly context: CompliancePolicyGatewayContext,
  ) {}

  public canEditField({
    classification,
    requiredCapability,
  }: GateEvaluationInput): boolean {
    if (!hasRequiredCapability(this.context.accessContext, requiredCapability)) {
      return false;
    }

    if (
      this.context.engine.resolvedPolicies.access
        .restrictedEditClassifications.includes(classification)
    ) {
      return this.context.accessContext.isAuthenticated;
    }

    return true;
  }

  public canExportRecord({
    classifications,
    requiredCapability,
  }: ExportEvaluationInput): boolean {
    if (!hasRequiredCapability(this.context.accessContext, requiredCapability)) {
      return false;
    }

    if (!this.context.engine.resolvedPolicies.retention.supportsExportRequest) {
      return false;
    }

    const restrictedClassificationSet = new Set(
      this.context.engine.resolvedPolicies.access.exportRestrictedClassifications,
    );

    return !classifications.some((classification) =>
      restrictedClassificationSet.has(classification),
    );
  }

  public canSendTelemetry({
    classifications,
    metadata,
    payload,
  }: TelemetryEvaluationInput): boolean {
    const resolvedClassifications =
      classifications ??
      (payload ? collectPayloadClassifications(payload, metadata) : []);

    const hasBlockedClassification = resolvedClassifications.some((classification) =>
      this.context.engine.resolvedPolicies.telemetry.blockedClassifications.includes(
        classification,
      ),
    );

    if (hasBlockedClassification) {
      return false;
    }

    return this.context.engine.resolvedPolicies.telemetry.requiredConsentCategories.every(
      (category) => this.context.consentState.categories[category] === 'granted',
    );
  }

  public canStoreLocally({
    classification,
    target,
    value,
  }: StorageEvaluationInput): boolean {
    const storagePolicy = this.context.engine.resolvedPolicies.storage;

    if (storagePolicy.forbiddenAllStorage.includes(classification)) {
      return false;
    }

    if (
      target === 'device' &&
      (storagePolicy.forbiddenDeviceStorage.includes(classification) ||
        storagePolicy.secureStoreOnly.includes(classification))
    ) {
      return false;
    }

    if (
      typeof value === 'string' &&
      this.context.engine.resolvedPolicies.payment.blockRawCardValues &&
      looksLikeCardNumber(value)
    ) {
      return false;
    }

    return true;
  }

  public canTriggerPaymentAction({
    containsRawCardData,
    requiredCapability,
  }: PaymentEvaluationInput): boolean {
    if (!hasRequiredCapability(this.context.accessContext, requiredCapability)) {
      return false;
    }

    if (
      this.context.engine.resolvedPolicies.payment.requireTokenizedPayments &&
      containsRawCardData
    ) {
      return false;
    }

    return true;
  }

  public canViewField({
    classification,
    requiredCapability,
  }: GateEvaluationInput): boolean {
    if (!hasRequiredCapability(this.context.accessContext, requiredCapability)) {
      return false;
    }

    const accessPolicy = this.context.engine.resolvedPolicies.access;

    if (
      accessPolicy.requireAuthenticationForSensitiveData &&
      accessPolicy.restrictedViewClassifications.includes(classification)
    ) {
      return this.context.accessContext.isAuthenticated;
    }

    return true;
  }

  public resolveFieldClassification(
    path: string,
    value: unknown,
    metadata?: FieldClassificationMap,
  ): DataClassification {
    return resolveClassification(path, value, metadata);
  }
}
