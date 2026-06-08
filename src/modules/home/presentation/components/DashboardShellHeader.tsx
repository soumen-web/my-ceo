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
  navigationTitle?: string;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  subtitle?: string;
  title?: string;
}

export const DashboardShellHeader = ({
  leftAccessibilityLabel = 'Open navigation menu',
  leftIcon = 'menu',
  navigationTitle,
  onMenuPress,
  onNotificationPress,
  subtitle = 'Human operations hub',
  title = 'MyCEO',
}: DashboardShellHeaderProps) => {
  const isBackHeader = Boolean(onMenuPress && leftIcon === 'arrow-left');
  const displayTitle = isBackHeader ? (navigationTitle ?? title) : title;
  const displaySubtitle = isBackHeader ? '' : subtitle;

  return (
    <View style={styles.header}>
      {onMenuPress ? (
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
      ) : null}

      {isBackHeader ? null : <UltiHumanLogo size="sm" variant="mark" />}

      <View style={[styles.titleGroup, !displaySubtitle ? styles.titleGroupSingleLine : undefined]}>
        <Text
          numberOfLines={1}
          style={[
            styles.headerTitle,
            !displaySubtitle ? styles.headerTitleSingleLine : undefined,
            isBackHeader ? styles.navigationTitle : undefined,
          ]}
        >
          {displayTitle}
        </Text>
        {displaySubtitle ? (
          <Text numberOfLines={1} style={styles.headerSubtitle}>
            {displaySubtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightActions}>
        <Pressable
          accessibilityLabel="Open notifications"
          accessibilityRole="button"
          accessibilityState={onNotificationPress ? undefined : { disabled: true }}
          disabled={!onNotificationPress}
          onPress={onNotificationPress}
          style={({ pressed }) => [
            styles.notificationButton,
            pressed ? styles.pressed : undefined,
          ]}
        >
          <Feather color={reactNativeColorScheme.ultiHuman.accentPressed} name="bell" size={20} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassSoft,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(44),
    justifyContent: 'center',
    width: spacing(44),
  },
  navigationTitle: {
    fontSize: fontSize(18),
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  notificationButton: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassSoft,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(17),
    borderWidth: 1,
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
