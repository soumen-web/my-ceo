import { env } from '@/config/env';

export const toAbsoluteAssetUrl = (value: string): string => {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return '';
  }

  if (/^(https?:\/\/|file:\/\/|content:\/\/|asset:\/\/|data:)/i.test(trimmedValue)) {
    return trimmedValue;
  }

  const normalizedPath = trimmedValue.replace(/^\/+/, '');
  const mediaBaseUrl = env.mediaBaseUrl.trim().replace(/\/+$/, '');
  const mediaBaseLastSegment =
    mediaBaseUrl.split('/').filter(Boolean).pop()?.toLowerCase() ?? '';
  const normalizedPathWithoutDuplicateBase =
    mediaBaseLastSegment && normalizedPath.toLowerCase().startsWith(`${mediaBaseLastSegment}/`)
      ? normalizedPath.slice(mediaBaseLastSegment.length + 1)
      : normalizedPath;

  return `${mediaBaseUrl}/${normalizedPathWithoutDuplicateBase}`;
};
