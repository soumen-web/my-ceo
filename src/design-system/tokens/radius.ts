export const reactNativeRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
} as const;

export const radius = {
  pill: 999,
  ...reactNativeRadius,
} as const;
