import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { UltiHumanLogo } from '@/components/brand';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

interface DashboardShellHeaderProps {
  initials: string;
  leftAccessibilityLabel?: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  onMenuPress: () => void;
  onProfilePress?: () => void;
  subtitle?: string;
  title?: string;
}

export const DashboardShellHeader = ({
  initials,
  leftAccessibilityLabel = 'Open navigation menu',
  leftIcon = 'menu',
  onMenuPress,
  onProfilePress,
  subtitle = 'Human operations hub',
  title = 'MyCEO',
}: DashboardShellHeaderProps) => (
  <View style={styles.header}>
    <Pressable
      accessibilityLabel={leftAccessibilityLabel}
      accessibilityRole="button"
      onPress={onMenuPress}
      style={({ pressed }) => [
        styles.iconButton,
        pressed ? styles.pressed : undefined,
      ]}
    >
      <Feather color={reactNativeColorScheme.ultiHuman.accentPressed} name={leftIcon} size={22} />
    </Pressable>

    <UltiHumanLogo size="sm" variant="mark" />

    <View style={[styles.titleGroup, !subtitle ? styles.titleGroupSingleLine : undefined]}>
      <Text
        numberOfLines={1}
        style={[styles.headerTitle, !subtitle ? styles.headerTitleSingleLine : undefined]}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text numberOfLines={1} style={styles.headerSubtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>

    <View style={styles.rightActions}>
      <Pressable
        accessibilityLabel="Open profile details"
        accessibilityRole="button"
        accessibilityState={onProfilePress ? undefined : { disabled: true }}
        disabled={!onProfilePress}
        onPress={onProfilePress}
        style={({ pressed }) => [
          styles.profileButton,
          pressed ? styles.pressed : undefined,
        ]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: 'rgba(3, 86, 158, 0.18)',
    borderColor: 'rgba(3, 86, 158, 0.34)',
    borderWidth: 1,
    borderRadius: radius(17),
    height: spacing(34),
    justifyContent: 'center',
    width: spacing(34),
  },
  avatarText: {
    color: reactNativeColorScheme.ultiHuman.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(10),
    minHeight: spacing(58),
    paddingVertical: spacing(6),
  },
  headerSubtitle: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  headerTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    flex: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(19),
    includeFontPadding: false,
    lineHeight: spacing(25),
    minWidth: 0,
    textAlignVertical: 'center',
  },
  headerTitleSingleLine: {
    lineHeight: spacing(44),
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(44),
    justifyContent: 'center',
    width: spacing(44),
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  profileButton: {
    alignItems: 'center',
    height: spacing(44),
    justifyContent: 'center',
    width: spacing(44),
  },
  rightActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(8),
  },
  titleGroup: {
    flex: 1,
    justifyContent: 'center',
    minHeight: spacing(44),
    minWidth: 0,
  },
  titleGroupSingleLine: {
    height: spacing(44),
  },
});
