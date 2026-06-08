import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

export type EnterpriseStatusTone = 'danger' | 'neutral' | 'success' | 'warning';

interface EnterpriseStatusPillProps {
  label: string;
  tone: EnterpriseStatusTone;
}

const toneStyles: Record<
  EnterpriseStatusTone,
  { backgroundColor: string; borderColor: string; color: string }
> = {
  danger: {
    backgroundColor: reactNativeColorScheme.status.danger.background,
    borderColor: reactNativeColorScheme.status.danger.border,
    color: reactNativeColorScheme.status.danger.foreground,
  },
  neutral: {
    backgroundColor: reactNativeColorScheme.status.neutral.background,
    borderColor: reactNativeColorScheme.status.neutral.border,
    color: reactNativeColorScheme.status.neutral.foreground,
  },
  success: {
    backgroundColor: reactNativeColorScheme.status.success.background,
    borderColor: reactNativeColorScheme.status.success.border,
    color: reactNativeColorScheme.status.success.foreground,
  },
  warning: {
    backgroundColor: reactNativeColorScheme.status.warning.background,
    borderColor: reactNativeColorScheme.status.warning.border,
    color: reactNativeColorScheme.status.warning.foreground,
  },
};

export const EnterpriseStatusPill = ({ label, tone }: EnterpriseStatusPillProps) => {
  const toneStyle = toneStyles[tone];

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: toneStyle.backgroundColor,
          borderColor: toneStyle.borderColor,
        },
      ]}
    >
      <Text numberOfLines={1} style={[styles.text, { color: toneStyle.color }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius(999),
    borderWidth: 1,
    maxWidth: spacing(136),
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(5),
  },
  text: {
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
  },
});
