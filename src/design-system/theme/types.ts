import type { ColorSchemeName } from 'react-native';
import type { MD3Theme } from 'react-native-paper';
import type { Theme as NavigationTheme } from '@react-navigation/native';

import type { elevationLevels } from '@/design-system/tokens/elevation';
import type { radius } from '@/design-system/tokens/radius';
import type { spacing } from '@/design-system/tokens/spacing';
import type { typography } from '@/design-system/tokens/typography';
import type { semanticColorTokens } from '@/design-system/tokens/colors';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedThemeMode = Exclude<ThemePreference, 'system'>;

export interface AppTheme extends MD3Theme {
  elevationLevels: typeof elevationLevels;
  navigationTheme: NavigationTheme;
  radius: typeof radius;
  semanticColors: (typeof semanticColorTokens)[ResolvedThemeMode];
  spacing: typeof spacing;
  typography: typeof typography;
}

export type SystemColorScheme = ColorSchemeName;
