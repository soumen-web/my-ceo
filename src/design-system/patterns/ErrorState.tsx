import { StyleSheet, View } from 'react-native';

import { AppButton, AppText } from '@design-system/components';
import { semanticColorTokens } from '@/design-system/tokens/colors';
import { spacing } from '@/design-system/tokens/spacing';

interface ErrorStateProps {
  actionLabel?: string;
  description: string;
  onRetry?: () => void;
  title?: string;
}

export const ErrorState = ({
  actionLabel = 'Try again',
  description,
  onRetry,
  title = 'Something went wrong',
}: ErrorStateProps) => (
  <View style={styles.container}>
    <AppText variant="headlineSmall">{title}</AppText>
    <AppText style={styles.description} variant="bodyMedium">
      {description}
    </AppText>
    {onRetry ? (
      <AppButton mode="contained" onPress={onRetry}>
        {actionLabel}
      </AppButton>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  description: {
    color: semanticColorTokens.light.textSecondary,
    textAlign: 'center',
  },
});
