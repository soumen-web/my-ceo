import { useColorScheme } from 'react-native';

import { buildAppTheme, resolveThemeMode } from '@/design-system/theme';
import { useAppSelector } from '@/app/providers/state/hooks';
import { selectThemeMode } from '@/app/providers/state/uiPreferencesSlice';

export const useResolvedTheme = () => {
  const systemColorScheme = useColorScheme();
  const themePreference = useAppSelector(selectThemeMode);

  return buildAppTheme(resolveThemeMode(themePreference, systemColorScheme));
};
