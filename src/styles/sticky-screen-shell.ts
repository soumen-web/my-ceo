import { StyleSheet } from 'react-native';

import { BrandColors } from '@/constants/theme';
import { spacing } from '@/utils/scale';

export const stickyScreenShellStyles = StyleSheet.create({
  headerBottomFade: {
    height: spacing(28),
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 4,
  },
  headerFadeGradient: {
    height: '100%',
    width: '100%',
  },
  headerWrap: {
    backgroundColor: BrandColors.ultiHuman.bgPrimary,
    left: 0,
    paddingHorizontal: spacing(16),
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 5,
  },
  screen: {
    backgroundColor: BrandColors.ultiHuman.bgPrimary,
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
