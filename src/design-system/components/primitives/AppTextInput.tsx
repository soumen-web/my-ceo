import { HelperText, TextInput, type TextInputProps } from 'react-native-paper';

import { semanticColorTokens } from '@/design-system/tokens/colors';
import { ACCESSIBILITY } from '@shared/constants/accessibility';

export interface AppTextInputProps extends Omit<TextInputProps, 'theme'> {
  description?: string;
  errorText?: string | undefined;
}

export const AppTextInput = ({
  description,
  errorText,
  mode = 'outlined',
  ...props
}: AppTextInputProps) => (
  <>
    <TextInput
      activeOutlineColor={semanticColorTokens.light.primary}
      outlineColor={semanticColorTokens.light.border}
      selectionColor={semanticColorTokens.light.primary}
      textColor={semanticColorTokens.light.textPrimary}
      error={Boolean(errorText)}
      maxFontSizeMultiplier={ACCESSIBILITY.maxFontSizeMultiplier}
      mode={mode}
      {...props}
    />
    {errorText ? (
      <HelperText
        maxFontSizeMultiplier={ACCESSIBILITY.maxFontSizeMultiplier}
        type="error"
        visible
      >
        {errorText}
      </HelperText>
    ) : description ? (
      <HelperText
        maxFontSizeMultiplier={ACCESSIBILITY.maxFontSizeMultiplier}
        type="info"
        visible
      >
        {description}
      </HelperText>
    ) : null}
  </>
);
