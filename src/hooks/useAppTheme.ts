import { useTheme } from 'react-native-paper';

import type { AppTheme } from '@/design-system/theme/types';

export const useAppTheme = (): AppTheme => useTheme<AppTheme>();
