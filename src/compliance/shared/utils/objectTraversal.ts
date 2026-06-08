import { isRecord } from '@shared/utils/isRecord';

export type TransformValue = (value: unknown, path: string) => unknown;

export const transformStructuredValue = (
  value: unknown,
  transform: TransformValue,
  parentPath = '',
): unknown => {
  if (Array.isArray(value)) {
    return value.map((nestedValue, index) =>
      transformStructuredValue(
        nestedValue,
        transform,
        parentPath ? `${parentPath}[${index}]` : `[${index}]`,
      ),
    );
  }

  if (isRecord(value)) {
    return Object.entries(value).reduce<Record<string, unknown>>(
      (accumulator, [key, nestedValue]) => {
        const path = parentPath ? `${parentPath}.${key}` : key;
        accumulator[key] = transformStructuredValue(nestedValue, transform, path);
        return accumulator;
      },
      {},
    );
  }

  return transform(value, parentPath);
};
