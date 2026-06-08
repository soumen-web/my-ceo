export const reactNativeSpacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const spacing = {
  none: 0,
  ...reactNativeSpacing,
} as const;
