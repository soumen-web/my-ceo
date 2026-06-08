import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

interface DashboardScreenIntroProps {
  displayName: string;
  role: string;
}

export const DashboardScreenIntro = ({
  displayName,
  role,
}: DashboardScreenIntroProps) => (
  <LinearGradient
    colors={reactNativeColorScheme.ultiHuman.module.heroGradient}
    end={{ x: 1, y: 1 }}
    start={{ x: 0, y: 0 }}
    style={styles.intro}
  >
    <View style={styles.copy}>
      <Text style={styles.eyebrow}>Today</Text>
      <Text numberOfLines={1} style={styles.title}>
        Hello, {displayName}
      </Text>
      <Text style={styles.subtitle}>Your Workforce Hub is ready for the day.</Text>
    </View>
    <View style={styles.badge}>
      <Text numberOfLines={1} style={styles.badgeText}>
        {role}
      </Text>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: reactNativeColorScheme.ultiHuman.module.accentSoft,
    borderColor: reactNativeColorScheme.ultiHuman.module.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    maxWidth: spacing(132),
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(8),
  },
  badgeText: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  copy: {
    flex: 1,
    gap: spacing(3),
    minWidth: 0,
  },
  eyebrow: {
    color: reactNativeColorScheme.ultiHuman.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    textTransform: 'uppercase',
  },
  intro: {
    alignItems: 'flex-start',
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    overflow: 'hidden',
    padding: spacing(18),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(12), width: 0 },
    shadowOpacity: 0.38,
    shadowRadius: spacing(22),
  },
  subtitle: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  title: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(23),
    lineHeight: spacing(29),
  },
});
