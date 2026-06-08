import { Dimensions } from 'react-native';

import normalize from '@/utils/normalize';

export const scale = (value: number, factor?: number) => normalize(value, factor);
export const spacing = (value: number) => scale(value);
export const radius = (value: number) => scale(value);

const getFontFactor = () => {
  const { width, height } = Dimensions.get('window');
  const shortestSide = Math.min(width, height);

  if (shortestSide >= 900) return 1.32;
  if (shortestSide >= 768) return 1.24;
  if (shortestSide >= 600) return 1.16;
  return 1;
};

export const fontSize = (value: number) => scale(value, getFontFactor());
