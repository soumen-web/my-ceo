import { StyleSheet } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { BrandColors, BrandEffects } from '@/constants/theme';
import { fontSize, radius, spacing } from '@/utils/scale';

export const ultiHumanTypography = StyleSheet.create({
  actionButtonLabel: {
    color: BrandColors.ultiHuman.textSecondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  sectionLabelUppercase: {
    color: BrandColors.ultiHuman.textPrimary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    letterSpacing: 0.5,
    lineHeight: spacing(16),
    textTransform: 'uppercase',
  },
});

export const ultiHumanButtonGroups = StyleSheet.create({
  icon16: {
    height: spacing(16),
    width: spacing(16),
  },
  pillActionGradient: {
    alignItems: 'center',
    borderRadius: radius(100),
    flexDirection: 'row',
    height: spacing(54),
    justifyContent: 'center',
  },
  pillActionWrap: {
    backgroundColor: BrandColors.ultiHuman.cardBackground,
    borderRadius: radius(100),
    padding: spacing(16),
    shadowColor: BrandEffects.ultiHuman.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: spacing(16),
  },
});

export const ultiHumanFeedback = StyleSheet.create({
  errorText: {
    color: BrandColors.ultiHuman.error,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
});
