import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { PremiumAnimatedView, PremiumPressable } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { DashboardQuickAction } from '@/modules/home';
import { fontSize, radius, spacing } from '@/utils/scale';

interface DashboardQuickActionListProps {
  actions: DashboardQuickAction[];
  onActionPress: (action: DashboardQuickAction) => void;
}

export const DashboardQuickActionList = ({
  actions,
  onActionPress,
}: DashboardQuickActionListProps) => {
  if (!actions.length) {
    return (
      <PremiumAnimatedView distance={5} style={styles.emptyCard}>
        <View style={styles.iconFrame}>
          <Feather color={reactNativeColorScheme.ultiHuman.text} name="clipboard" size={18} />
        </View>
        <Text style={styles.emptyText}>No quick actions available yet.</Text>
      </PremiumAnimatedView>
    );
  }

  return (
    <View style={styles.list}>
      {actions.map((action, index) => (
        <PremiumAnimatedView delay={index * 56} distance={5} key={action.id}>
          <PremiumPressable
            accessibilityRole="button"
            android_ripple={{ color: 'rgba(3, 86, 158, 0.12)' }}
            hitSlop={spacing(4)}
            onPress={() => onActionPress(action)}
            style={({ pressed }) => [
              styles.item,
              pressed ? styles.itemPressed : undefined,
            ]}
          >
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.98)',
                'rgba(236, 248, 255, 0.94)',
                'rgba(204, 239, 255, 0.82)',
              ]}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.accentRail} />
            <View style={styles.iconFrame}>
              <Feather color={reactNativeColorScheme.ultiHuman.text} name={action.icon} size={18} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.kicker}>Quick action</Text>
              <Text numberOfLines={2} style={styles.label}>
                {action.label}
              </Text>
            </View>
            <Feather color={reactNativeColorScheme.text.disabled} name="chevron-right" size={18} />
          </PremiumPressable>
        </PremiumAnimatedView>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  accentRail: {
    backgroundColor: reactNativeColorScheme.ultiHuman.module.accentPressed,
    borderBottomRightRadius: radius(8),
    borderTopRightRadius: radius(8),
    bottom: spacing(14),
    left: 0,
    position: 'absolute',
    top: spacing(14),
    width: spacing(3),
  },
  copy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(14),
    minHeight: spacing(72),
    paddingHorizontal: spacing(16),
  },
  emptyText: {
    color: reactNativeColorScheme.text.secondary,
    flex: 1,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(14),
    lineHeight: spacing(20),
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.module.iconSurface,
    borderColor: 'rgba(255, 255, 255, 0.74)',
    borderRadius: radius(999),
    borderWidth: 1,
    height: spacing(42),
    justifyContent: 'center',
    width: spacing(42),
  },
  item: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(3, 86, 158, 0.34)',
    borderRadius: radius(8),
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    gap: spacing(12),
    minHeight: spacing(70),
    overflow: 'hidden',
    paddingHorizontal: spacing(16),
    paddingVertical: spacing(12),
    position: 'relative',
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: spacing(16),
  },
  itemPressed: {
    opacity: 0.82,
  },
  label: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(15),
    lineHeight: spacing(20),
  },
  kicker: {
    color: reactNativeColorScheme.ultiHuman.module.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
    textTransform: 'uppercase',
  },
  list: {
    gap: spacing(12),
  },
});
