import { StyleSheet, View } from 'react-native';

import { AppText, PremiumAnimatedView, PremiumSkeleton } from '@design-system/components';
import { spacing } from '@/design-system/tokens/spacing';

interface LoadingStateProps {
  label?: string;
}

export const LoadingState = ({
  label = 'Preparing workspace...',
}: LoadingStateProps) => (
    <PremiumAnimatedView distance={6} scaleFrom={0.99} style={styles.container}>
      <View style={styles.skeletonStack}>
        <PremiumSkeleton style={styles.skeletonHero} />
        <PremiumSkeleton style={styles.skeletonLine} />
        <PremiumSkeleton style={styles.skeletonLineShort} />
      </View>
      <AppText style={styles.label} variant="bodyMedium">
        {label}
      </AppText>
    </PremiumAnimatedView>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.lg,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  label: {
    textAlign: 'center',
  },
  skeletonHero: {
    height: 64,
    width: 96,
  },
  skeletonLine: {
    height: 12,
    width: 180,
  },
  skeletonLineShort: {
    height: 12,
    width: 132,
  },
  skeletonStack: {
    alignItems: 'center',
    gap: spacing.sm,
  },
});
