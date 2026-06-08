import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

interface DashboardQuickActionProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
}

export const DashboardQuickAction = ({
  icon,
  label,
  onPress,
}: DashboardQuickActionProps) => (
  <Pressable
    accessibilityRole="button"
    android_ripple={{ color: 'rgba(59, 145, 234, 0.12)' }}
    hitSlop={spacing(4)}
    onPress={onPress}
    style={({ pressed }) => [
      styles.action,
      pressed ? styles.actionPressed : undefined,
    ]}
  >
    <View style={styles.iconFrame}>
      <Feather color={reactNativeColorScheme.ultiHuman.text} name={icon} size={18} />
    </View>
    <Text numberOfLines={2} style={styles.label}>
      {label}
    </Text>
    <Feather color={reactNativeColorScheme.text.muted} name="chevron-right" size={18} />
  </Pressable>
);

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    gap: spacing(12),
    minHeight: spacing(66),
    paddingHorizontal: spacing(16),
    paddingVertical: spacing(12),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(5), width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: spacing(12),
  },
  actionPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.accent,
    borderRadius: radius(8),
    height: spacing(40),
    justifyContent: 'center',
    width: spacing(40),
  },
  label: {
    color: reactNativeColorScheme.ultiHuman.text,
    flex: 1,
    fontFamily: AppFonts.googleSansSemiBold,
    fontSize: fontSize(14),
    lineHeight: spacing(20),
  },
});
