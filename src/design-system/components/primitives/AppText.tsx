import type { StyleProp, TextStyle } from 'react-native';
import { Text, type TextProps, useTheme } from 'react-native-paper';

import { ACCESSIBILITY } from '@shared/constants/accessibility';

type AppTextTone = 'default' | 'error' | 'muted';

export interface AppTextProps extends TextProps<never> {
  tone?: AppTextTone;
}

export const AppText = ({
  children,
  style,
  tone = 'default',
  ...props
}: AppTextProps) => {
  const theme = useTheme();

  const toneStyle: StyleProp<TextStyle> =
    tone === 'error'
      ? { color: theme.colors.error }
      : tone === 'muted'
        ? { color: theme.colors.onSurfaceVariant }
        : undefined;

  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={ACCESSIBILITY.maxFontSizeMultiplier}
      style={[toneStyle, style]}
      {...props}
    >
      {children}
    </Text>
  );
};
