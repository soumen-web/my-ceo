import { isRecord } from '@/shared/utils/isRecord';

export const jsonSerializer = {
  ensureObject<T>(value: unknown): T {
    if (!isRecord(value)) {
      throw new Error('Expected a JSON object payload.');
    }

    return value as T;
  },
};
