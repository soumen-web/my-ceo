import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import {
  MD3DarkTheme,
  MD3LightTheme,
  type MD3Theme,
} from 'react-native-paper';

import { colorTokens, semanticColorTokens } from '@/design-system/tokens/colors';
import { elevationLevels } from '@/design-system/tokens/elevation';
import { radius } from '@/design-system/tokens/radius';
import { spacing } from '@/design-system/tokens/spacing';
import { typography } from '@/design-system/tokens/typography';

import type {
  AppTheme,
  ResolvedThemeMode,
  SystemColorScheme,
  ThemePreference,
} from './types';

const buildNavigationTheme = (
  mode: ResolvedThemeMode,
  colors: AppTheme['colors'],
): NavigationTheme => {
  const baseTheme =
    mode === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: colors.background,
      border: colors.outlineVariant,
      card: colors.surface,
      notification: colors.error,
      primary: colors.primary,
      text: colors.onSurface,
    },
  };
};

const buildPaperTheme = (
  baseTheme: MD3Theme,
  mode: ResolvedThemeMode,
): AppTheme => {
  const colors = {
    ...baseTheme.colors,
    ...colorTokens[mode],
  };

  return {
    ...baseTheme,
    colors,
    dark: mode === 'dark',
    elevationLevels,
    navigationTheme: buildNavigationTheme(mode, colors),
    radius,
    semanticColors: semanticColorTokens[mode],
    spacing,
    typography,
  };
};

export const resolveThemeMode = (
  preference: ThemePreference,
  systemColorScheme: SystemColorScheme,
): ResolvedThemeMode => {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }

  return systemColorScheme === 'dark' ? 'dark' : 'light';
};

export const buildAppTheme = (mode: ResolvedThemeMode): AppTheme =>
  buildPaperTheme(mode === 'dark' ? MD3DarkTheme : MD3LightTheme, mode);
