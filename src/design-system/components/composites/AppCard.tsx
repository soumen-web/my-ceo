import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

import { semanticColorTokens } from '@design-system/tokens/colors';
import { radius } from '@design-system/tokens/radius';
import { spacing } from '@design-system/tokens/spacing';

interface AppCardContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface AppCardProps {
  accessibilityLabel?: string;
  children: ReactNode;
  mode?: 'contained' | 'elevated' | 'outlined';
  style?: StyleProp<ViewStyle>;
}

export const AppCard = ({
  accessibilityLabel,
  children,
  mode = 'contained',
  style,
}: AppCardProps) => (
  <Card accessibilityLabel={accessibilityLabel} mode={mode} style={[styles.card, style]}>
    {children}
  </Card>
);

export const AppCardContent = ({
  children,
  style,
}: AppCardContentProps) => (
  <Card.Content style={[styles.content, style]}>{children}</Card.Content>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticColorTokens.light.card,
    borderColor: semanticColorTokens.light.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    shadowColor: semanticColorTokens.light.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 16,
  },
  content: {
    gap: spacing.sm,
  },
});
