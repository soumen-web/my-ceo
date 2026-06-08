import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

import { auditService } from '@compliance/core/audit/auditService';
import { CompliancePolicyError } from '@compliance/core/errors/CompliancePolicyError';
import { complianceRuntime } from '@compliance/core/runtime/complianceRuntime';
import type { ComplianceRequestContext } from '@compliance/core/types/api';
import { scrubPayloadBeforeNetwork } from '@compliance/shared/redaction/sanitize';
import { collectPayloadClassifications, looksLikeCardNumber } from '@compliance/shared/utils/classifyData';

const containsRawCardData = (value: unknown): boolean =>
  collectPayloadClassifications(value).includes('PAYMENT_SENSITIVE') ||
  (typeof value === 'string' && looksLikeCardNumber(value));

const appendComplianceHeaders = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const activeModules = complianceRuntime.getActiveModuleIds();

  if (activeModules.length === 0) {
    return config;
  }

  if (typeof config.headers?.set === 'function') {
    config.headers.set('X-Compliance-Modules', activeModules.join(','));
    return config;
  }

  const headers = new AxiosHeaders(config.headers);
  headers.set('X-Compliance-Modules', activeModules.join(','));
  config.headers = headers;
  return config;
};

const isMultipartRequest = (config: InternalAxiosRequestConfig): boolean => {
  const contentTypeFromGetter = typeof config.headers?.get === 'function'
    ? config.headers.get('Content-Type') ?? config.headers.get('content-type')
    : undefined;
  const contentTypeFromObject =
    !contentTypeFromGetter &&
    config.headers &&
    typeof config.headers === 'object' &&
    !Array.isArray(config.headers)
      ? (config.headers as Record<string, unknown>)['Content-Type'] ??
        (config.headers as Record<string, unknown>)['content-type']
      : undefined;
  const contentType =
    typeof contentTypeFromGetter === 'string'
      ? contentTypeFromGetter
      : typeof contentTypeFromObject === 'string'
        ? contentTypeFromObject
        : undefined;
  const hasMultipartHeader =
    typeof contentType === 'string' &&
    contentType.toLowerCase().includes('multipart/form-data');
  const hasFormDataBody =
    typeof FormData !== 'undefined' && config.data instanceof FormData;
  const hasReactNativeFormDataParts =
    Boolean(config.data) &&
    typeof config.data === 'object' &&
    Array.isArray((config.data as { _parts?: unknown[] })._parts);

  return hasMultipartHeader || hasFormDataBody || hasReactNativeFormDataParts;
};

export const prepareApiRequestForCompliance = async (
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  const complianceContext = config.compliance as ComplianceRequestContext | undefined;
  const multipartRequest = isMultipartRequest(config);

  if (config.data && !multipartRequest && containsRawCardData(config.data)) {
    const isAllowed = complianceRuntime
      .getPolicyGateway()
      .canTriggerPaymentAction({
        containsRawCardData: true,
      });

    if (!isAllowed) {
      await auditService.record({
        action: 'compliance_restricted_action_blocked',
        classification: 'PAYMENT_SENSITIVE',
        details: {
          operation: complianceContext?.operationName ?? config.url,
        },
        moduleIds: complianceRuntime.getActiveModuleIds(),
        outcome: 'blocked',
        resource: complianceContext?.resource ?? config.url,
        timestamp: new Date().toISOString(),
      });
      throw new CompliancePolicyError(
        'Raw payment card data is blocked by active compliance policy.',
        'PCI_PAYMENT_BLOCKED',
      );
    }
  }

  if (config.data && !multipartRequest) {
    config.data = scrubPayloadBeforeNetwork(
      config.data,
      complianceContext?.fieldClassifications,
      complianceRuntime.getResolvedPolicies(),
    );
  }

  config = appendComplianceHeaders(config);
  config.metadata = {
    ...config.metadata,
    compliance: {
      auditAction: complianceContext?.auditAction,
      operationName: complianceContext?.operationName,
      resource: complianceContext?.resource,
      safePayload: complianceRuntime.sanitizeForTelemetry(
        multipartRequest ? undefined : config.data,
        complianceContext?.fieldClassifications,
      ) as Record<string, unknown> | undefined,
    },
  };

  return config;
};
