import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

interface EnterpriseListRowProps {
  count?: number;
  eyebrow?: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  subtitle: string;
  title: string;
}

const moduleColors = reactNativeColorScheme.ultiHuman.module;

export const EnterpriseListRow = ({
  count,
  eyebrow,
  icon,
  onPress,
  subtitle,
  title,
}: EnterpriseListRowProps) => (
  <Pressable
    accessibilityRole="button"
    android_ripple={{ color: moduleColors.accentWash }}
    onPress={onPress}
    style={({ pressed }) => [
      styles.pressable,
      pressed ? styles.rowPressed : undefined,
    ]}
  >
    <LinearGradient
      colors={moduleColors.heroGradient}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.row}
    >
      <View style={styles.iconFrame}>
        <Feather color={moduleColors.icon} name={icon} size={19} />
      </View>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={2} style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
      {typeof count === 'number' ? (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      ) : null}
      <Feather color={reactNativeColorScheme.text.disabled} name="chevron-right" size={18} />
    </LinearGradient>
  </Pressable>
);

const styles = StyleSheet.create({
  copy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  countBadge: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(32),
    justifyContent: 'center',
    width: spacing(32),
  },
  countText: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  eyebrow: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(46),
    justifyContent: 'center',
    width: spacing(46),
  },
  pressable: {
    borderRadius: radius(8),
  },
  row: {
    alignItems: 'center',
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    minHeight: spacing(86),
    paddingHorizontal: spacing(14),
    paddingVertical: spacing(12),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: spacing(16),
  },
  rowPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  subtitle: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  title: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(22),
  },
});
