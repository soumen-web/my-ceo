import { isRecord } from '@shared/utils/isRecord';

import type { ServerFieldError, ServerValidationErrorPayload } from '@shared/core/validation/types';

const hasFieldErrors = (value: unknown): value is ServerValidationErrorPayload => {
  if (!isRecord(value)) {
    return false;
  }

  return Array.isArray(value.fieldErrors);
};

export const mapServerFieldErrors = (
  value: unknown,
): Record<string, string> => {
  if (!hasFieldErrors(value)) {
    return {};
  }

  return (value.fieldErrors ?? []).reduce<Record<string, string>>(
    (accumulator, currentError: ServerFieldError) => {
      accumulator[currentError.field] = currentError.message;
      return accumulator;
    },
    {},
  );
};
