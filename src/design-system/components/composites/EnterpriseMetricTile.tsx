import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

interface EnterpriseMetricTileProps {
  label: string;
  value: number | string;
}

const moduleColors = reactNativeColorScheme.ultiHuman.module;

export const EnterpriseMetricTile = ({ label, value }: EnterpriseMetricTileProps) => (
  <View style={styles.tile}>
    <Text numberOfLines={1} style={styles.value}>
      {value}
    </Text>
    <Text numberOfLines={1} style={styles.label}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  label: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  tile: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(2),
    minWidth: spacing(112),
    paddingVertical: spacing(12),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(5), width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: spacing(10),
  },
  value: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(20),
    lineHeight: spacing(26),
  },
});
