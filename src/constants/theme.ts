import { reactNativeColorScheme } from '@/design-system/tokens/colors';

export const Colors = {
  light: {
    background: reactNativeColorScheme.surface.canvas,
    icon: reactNativeColorScheme.text.muted,
    tabIconDefault: reactNativeColorScheme.text.muted,
    tabIconSelected: reactNativeColorScheme.brand[700],
    text: reactNativeColorScheme.text.primary,
    tint: reactNativeColorScheme.brand[600],
  },
  dark: {
    background: reactNativeColorScheme.slate[950],
    icon: reactNativeColorScheme.slate[400],
    tabIconDefault: reactNativeColorScheme.slate[400],
    tabIconSelected: reactNativeColorScheme.text.inverse,
    text: reactNativeColorScheme.slate[50],
    tint: reactNativeColorScheme.brand[300],
  },
} as const;

const ultiHumanBrandColors = {
  badgeBackground: reactNativeColorScheme.status.info.background,
  bgPrimary: reactNativeColorScheme.ultiHuman.background,
  cardBackground: reactNativeColorScheme.surface.raised,
  cardShadow: reactNativeColorScheme.ultiHuman.surface.cardShadow,
  confirmationBackground: reactNativeColorScheme.status.success.background,
  confirmationCheckmark: reactNativeColorScheme.status.success.strong,
  confirmationGradientStart: reactNativeColorScheme.brand[50],
  error: reactNativeColorScheme.status.danger.strong,
  floralLine: reactNativeColorScheme.brand[400],
  formActiveBorder: reactNativeColorScheme.border.focus,
  formBorder: reactNativeColorScheme.border.subtle,
  formPlaceholder: reactNativeColorScheme.text.disabled,
  formTextActive: reactNativeColorScheme.text.primary,
  headerBackground: reactNativeColorScheme.brand[100],
  iconPrimary: reactNativeColorScheme.brand[600],
  noteBackground: reactNativeColorScheme.surface.sunken,
  pinkPrimary300: reactNativeColorScheme.brand[200],
  pinkPrimary400: reactNativeColorScheme.brand[400],
  splashTitle: reactNativeColorScheme.brand[700],
  textPrimary: reactNativeColorScheme.text.primary,
  textSecondary: reactNativeColorScheme.text.secondary,
} as const;

export const BrandColors = {
  ultiHuman: ultiHumanBrandColors,
} as const;

export const BrandEffects = {
  ultiHuman: {
    headerFadeColors: [
      'rgba(255, 255, 255, 0.92)',
      'rgba(255, 255, 255, 0.35)',
      'rgba(255, 255, 255, 0)',
    ] as const,
    shadowColor: reactNativeColorScheme.slate[950],
  },
} as const;
