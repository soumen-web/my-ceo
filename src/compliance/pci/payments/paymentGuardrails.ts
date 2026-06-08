import { CompliancePolicyError } from '@compliance/core/errors/CompliancePolicyError';
import { complianceRuntime } from '@compliance/core/runtime/complianceRuntime';
import { looksLikeCardNumber } from '@compliance/shared/utils/classifyData';

const containsRawPaymentSensitiveValue = (payload: unknown): boolean => {
  if (typeof payload === 'string') {
    return looksLikeCardNumber(payload);
  }

  if (Array.isArray(payload)) {
    return payload.some(containsRawPaymentSensitiveValue);
  }

  if (payload && typeof payload === 'object') {
    return Object.values(payload).some(containsRawPaymentSensitiveValue);
  }

  return false;
};

export const paymentGuardrails = {
  assertTokenizedPaymentPayload(payload: unknown): void {
    if (
      complianceRuntime.getResolvedPolicies().payment.requireTokenizedPayments &&
      containsRawPaymentSensitiveValue(payload)
    ) {
      throw new CompliancePolicyError(
        'Raw payment data is blocked. Use tokenized or hosted payment flows.',
        'PCI_TOKENIZED_FLOW_REQUIRED',
      );
    }
  },
};
