import { StyleSheet } from 'react-native';
import { Button, type ButtonProps } from 'react-native-paper';

import { semanticColorTokens } from '@/design-system/tokens/colors';
import { ACCESSIBILITY } from '@shared/constants/accessibility';

export const AppButton = ({
  children,
  contentStyle,
  mode = 'contained',
  ...props
}: ButtonProps) => (
  <Button
    buttonColor={mode === 'contained' ? semanticColorTokens.light.primary : undefined}
    contentStyle={[styles.content, contentStyle]}
    mode={mode}
    textColor={mode === 'contained' ? semanticColorTokens.light.textInverse : semanticColorTokens.light.primary}
    {...props}
  >
    {children}
  </Button>
);

const styles = StyleSheet.create({
  content: {
    minHeight: ACCESSIBILITY.minTouchTargetSize,
  },
});
