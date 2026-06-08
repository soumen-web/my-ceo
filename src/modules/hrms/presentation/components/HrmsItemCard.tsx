import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { HrmsSelfServiceItem } from '@/modules/hrms/domain/entities/HrmsSelfService';
import { fontSize, radius, spacing } from '@/utils/scale';

import { HrmsStatusPill } from './HrmsStatusPill';

interface HrmsItemCardProps {
  item: HrmsSelfServiceItem;
  onPress?: () => void;
}

const moduleColors = reactNativeColorScheme.ultiHuman.module;

const getInitials = (value: string): string => {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  return parts.length ? parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase() : 'UH';
};

const HrmsItemCardComponent = ({ item, onPress }: HrmsItemCardProps) => {
  const primaryRows = item.detailRows.slice(0, 3);
  const secondaryCount = Math.max(0, item.detailRows.length - primaryRows.length);

  return (
    <Pressable
      accessibilityLabel={`${item.title}. ${item.statusLabel}. ${item.subtitle}`}
      accessibilityRole={onPress ? 'button' : 'summary'}
      android_ripple={{ color: moduleColors.accentWash }}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed ? styles.pressed : undefined]}
      testID={`workforce-item-${item.id}`}
    >
      <LinearGradient
        colors={moduleColors.heroGradient}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.avatarShell}>
            <Text style={styles.avatarText}>{getInitials(item.title)}</Text>
          </View>

          <View style={styles.copy}>
            <View style={styles.metaRow}>
              <Text numberOfLines={1} style={styles.meta}>
                {item.meta}
              </Text>
            </View>
            <Text numberOfLines={2} style={styles.title}>
              {item.title}
            </Text>
            <Text numberOfLines={1} style={styles.subtitle}>
              {item.subtitle}
            </Text>
          </View>

          <HrmsStatusPill label={item.statusLabel} tone={item.statusTone} />
        </View>

        <View style={styles.insightPanel}>
          {primaryRows.map((row) => (
            <View key={`${item.id}-${row.label}`} style={styles.insight}>
              <Text numberOfLines={1} style={styles.rowLabel}>
                {row.label}
              </Text>
              <Text numberOfLines={2} style={styles.rowValue}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerAction}>
            <Feather color={moduleColors.icon} name="zap" size={spacing(14)} />
            <Text style={styles.footerText}>
              {secondaryCount ? `${secondaryCount} more signals` : 'Profile ready'}
            </Text>
          </View>
          <Feather color={reactNativeColorScheme.text.disabled} name="chevron-right" size={18} />
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export const HrmsItemCard = memo(HrmsItemCardComponent);

const styles = StyleSheet.create({
  avatarShell: {
    alignItems: 'center',
    backgroundColor: moduleColors.ink,
    borderColor: 'rgba(255, 255, 255, 0.74)',
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(52),
    justifyContent: 'center',
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: spacing(14),
    width: spacing(52),
  },
  avatarText: {
    color: reactNativeColorScheme.text.inverse,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(22),
  },
  card: {
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(14),
    overflow: 'hidden',
    padding: spacing(15),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(10), width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: spacing(18),
  },
  copy: {
    flex: 1,
    gap: spacing(3),
    minWidth: 0,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerAction: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(7),
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(7),
  },
  footerText: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing(12),
  },
  insight: {
    backgroundColor: 'rgba(255, 255, 255, 0.64)',
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(3),
    minWidth: spacing(84),
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(9),
  },
  insightPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  meta: {
    color: moduleColors.accentPressed,
    flex: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(8),
  },
  pressable: {
    borderRadius: radius(8),
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  rowLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  rowValue: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  subtitle: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  title: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(17),
    lineHeight: spacing(23),
  },
});
