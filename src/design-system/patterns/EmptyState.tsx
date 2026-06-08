import { StyleSheet, View } from 'react-native';

import { AppButton, AppText, PremiumAnimatedView } from '@design-system/components';
import { semanticColorTokens } from '@/design-system/tokens/colors';
import { spacing } from '@/design-system/tokens/spacing';

interface EmptyStateProps {
  actionLabel?: string;
  description: string;
  onActionPress?: () => void;
  title: string;
}

export const EmptyState = ({
  actionLabel,
  description,
  onActionPress,
  title,
}: EmptyStateProps) => (
  <PremiumAnimatedView distance={6} scaleFrom={0.99} style={styles.container}>
    <View style={styles.iconHalo} />
    <View style={styles.copy}>
      <AppText variant="headlineSmall">{title}</AppText>
      <AppText style={styles.description} variant="bodyMedium">
        {description}
      </AppText>
    </View>
    {actionLabel && onActionPress ? (
      <AppButton mode="contained" onPress={onActionPress}>
        {actionLabel}
      </AppButton>
    ) : null}
  </PremiumAnimatedView>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    justifyContent: 'center',
    minHeight: 240,
    padding: spacing.xl,
  },
  copy: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  description: {
    textAlign: 'center',
  },
  iconHalo: {
    backgroundColor: semanticColorTokens.light.status.info.background,
    borderColor: semanticColorTokens.light.status.info.border,
    borderWidth: 1,
    borderRadius: 28,
    height: 56,
    width: 56,
  },
});
