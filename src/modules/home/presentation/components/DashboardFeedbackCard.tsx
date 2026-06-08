import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { PremiumAnimatedView } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

interface DashboardFeedbackCardProps {
  message: string;
  tone?: 'error' | 'loading' | 'muted';
}

export const DashboardFeedbackCard = ({
  message,
  tone = 'muted',
}: DashboardFeedbackCardProps) => {
  const isError = tone === 'error';
  const isLoading = tone === 'loading';

  return (
    <PremiumAnimatedView
      distance={isError ? 3 : 5}
      scaleFrom={0.99}
      style={[styles.card, isError ? styles.errorCard : undefined]}
    >
      <View style={[styles.iconFrame, isError ? styles.errorIconFrame : undefined]}>
        {isLoading ? (
          <ActivityIndicator color={reactNativeColorScheme.ultiHuman.accent} size="small" />
        ) : (
          <Feather
            color={
              isError
                ? reactNativeColorScheme.status.danger.foreground
                : reactNativeColorScheme.ultiHuman.accent
            }
            name={isError ? 'alert-circle' : 'inbox'}
            size={18}
          />
        )}
      </View>
      <Text style={[styles.text, isError ? styles.errorText : undefined]}>{message}</Text>
    </PremiumAnimatedView>
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    elevation: 2,
    flexDirection: 'row',
    gap: spacing(14),
    minHeight: spacing(72),
    paddingHorizontal: spacing(16),
    paddingVertical: spacing(14),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(5), width: 0 },
    shadowOpacity: 0.16,
    shadowRadius: spacing(12),
  },
  errorCard: {
    backgroundColor: reactNativeColorScheme.status.danger.background,
    borderColor: reactNativeColorScheme.status.danger.border,
  },
  errorIconFrame: {
    backgroundColor: 'rgba(255, 255, 255, 0.62)',
    borderColor: reactNativeColorScheme.status.danger.border,
  },
  errorText: {
    color: reactNativeColorScheme.status.danger.foreground,
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: 'rgba(59, 145, 234, 0.12)',
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(44),
    justifyContent: 'center',
    width: spacing(44),
  },
  text: {
    color: reactNativeColorScheme.text.secondary,
    flex: 1,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(14),
    lineHeight: spacing(20),
  },
});
