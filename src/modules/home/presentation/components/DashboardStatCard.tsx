import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

interface DashboardStatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}

export const DashboardStatCard = ({
  icon,
  label,
  value,
}: DashboardStatCardProps) => (
  <View style={styles.card}>
    <View style={styles.iconFrame}>
      <Feather color={reactNativeColorScheme.brand[700]} name={icon} size={24} />
    </View>
    <View style={styles.content}>
      <Text adjustsFontSizeToFit minimumFontScale={0.82} numberOfLines={1} style={styles.value}>
        {value}
      </Text>
      <Text numberOfLines={2} style={styles.label}>
        {label}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorder,
    borderRadius: radius(8),
    borderWidth: 1,
    elevation: 3,
    gap: spacing(12),
    minHeight: spacing(112),
    padding: spacing(16),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(7), width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: spacing(16),
    width: '100%',
  },
  content: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: 'rgba(59, 145, 234, 0.14)',
    borderColor: 'rgba(59, 145, 234, 0.28)',
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(40),
    justifyContent: 'center',
    width: spacing(40),
  },
  label: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  value: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(23),
    lineHeight: spacing(29),
  },
});
