import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, spacing } from '@/utils/scale';

interface DashboardSectionProps {
  subtitle?: string;
  title: string;
}

export const DashboardSection = ({
  children,
  subtitle,
  title,
}: PropsWithChildren<DashboardSectionProps>) => (
  <View style={styles.section}>
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  header: {
    gap: spacing(4),
    paddingHorizontal: spacing(2),
  },
  section: {
    gap: spacing(14),
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
    fontSize: fontSize(17),
    lineHeight: spacing(23),
  },
});
