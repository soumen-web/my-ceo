import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { PremiumAnimatedView } from '@/design-system/components/composites/PremiumMotion';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

type EnterpriseFeedbackTone = 'empty' | 'error' | 'info' | 'loading';

interface EnterpriseFeedbackBannerProps {
  message: string;
  title?: string;
  tone?: EnterpriseFeedbackTone;
}

const toneConfig: Record<
  Exclude<EnterpriseFeedbackTone, 'loading'>,
  { icon: keyof typeof Feather.glyphMap; iconColor: string; surface: object }
> = {
  empty: {
    icon: 'check-circle',
    iconColor: reactNativeColorScheme.ultiHuman.accentPressed,
    surface: {},
  },
  error: {
    icon: 'alert-circle',
    iconColor: reactNativeColorScheme.status.danger.foreground,
    surface: {
      backgroundColor: reactNativeColorScheme.status.danger.background,
      borderColor: reactNativeColorScheme.status.danger.border,
    },
  },
  info: {
    icon: 'info',
    iconColor: reactNativeColorScheme.ultiHuman.accentPressed,
    surface: {},
  },
};

export const EnterpriseFeedbackBanner = ({
  message,
  title,
  tone = 'info',
}: EnterpriseFeedbackBannerProps) => {
  const config = tone === 'loading' ? undefined : toneConfig[tone];

  return (
    <PremiumAnimatedView
      distance={tone === 'error' ? 3 : 5}
      scaleFrom={tone === 'error' ? 0.995 : 0.99}
      style={[styles.banner, config?.surface]}
    >
      {tone === 'loading' ? (
        <ActivityIndicator color={reactNativeColorScheme.ultiHuman.accent} size="small" />
      ) : config ? (
        <Feather color={config.iconColor} name={config.icon} size={18} />
      ) : null}
      <View style={styles.copy}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={[styles.message, tone === 'error' ? styles.errorMessage : undefined]}>
          {message}
        </Text>
      </View>
    </PremiumAnimatedView>
  );
};

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    minHeight: spacing(58),
    paddingHorizontal: spacing(14),
    paddingVertical: spacing(12),
  },
  copy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  errorMessage: {
    color: reactNativeColorScheme.status.danger.foreground,
  },
  message: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  title: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
});
