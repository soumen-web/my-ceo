import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ReturnKeyTypeOptions,
} from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { ultiHumanFeedback } from '@/styles/ulti-human-groups';
import { fontSize, spacing } from '@/utils/scale';

const ultiHumanColors = reactNativeColorScheme.ultiHuman;
type FeatherIconName = keyof typeof Feather.glyphMap;

const resolveLeadingIcon = (
  keyboardType: AuthInputFieldProps['keyboardType'],
  textContentType: AuthInputFieldProps['textContentType'],
): FeatherIconName => {
  if (keyboardType === 'email-address' || textContentType === 'emailAddress') {
    return 'mail';
  }

  if (textContentType === 'password') {
    return 'lock';
  }

  return 'user';
};

interface AuthInputFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  errorMessage?: string | undefined;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'words';
  textContentType?:
    | 'emailAddress'
    | 'name'
    | 'none'
    | 'password'
    | 'username'
    | 'givenName'
    | 'familyName';
  active?: boolean;
  onSubmitEditing?: (() => void) | undefined;
  returnKeyType?: ReturnKeyTypeOptions;
  showEyeToggle?: boolean;
  onPressEyeToggle?: (() => void) | undefined;
}

export const AuthInputField = ({
  active = false,
  autoCapitalize = 'none',
  errorMessage,
  keyboardType = 'default',
  label,
  onChangeText,
  onPressEyeToggle,
  onSubmitEditing,
  placeholder,
  returnKeyType = 'next',
  secureTextEntry = false,
  showEyeToggle = false,
  textContentType = 'none',
  value,
}: AuthInputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = active || isFocused;
  const leadingIcon = resolveLeadingIcon(keyboardType, textContentType);
  const statusIconColor = errorMessage
    ? reactNativeColorScheme.status.danger.strong
    : ultiHumanColors.accentPressed;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, isActive ? styles.labelActive : undefined]}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          isActive ? styles.inputWrapActive : undefined,
          errorMessage ? styles.inputWrapError : undefined,
        ]}
      >
        <View style={[styles.iconFrame, isActive ? styles.iconFrameActive : undefined]}>
          <Feather
            color={isActive ? ultiHumanColors.text : ultiHumanColors.accentPressed}
            name={leadingIcon}
            size={16}
          />
        </View>
        <TextInput
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          keyboardType={keyboardType}
          onBlur={() => setIsFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={ultiHumanColors.muted}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          selectionColor={ultiHumanColors.accentPressed}
          style={styles.input}
          textContentType={textContentType}
          value={value}
        />
        {showEyeToggle ? (
          <Pressable hitSlop={8} onPress={onPressEyeToggle} style={styles.eyeButton}>
            <Feather
              color={ultiHumanColors.muted}
              name={secureTextEntry ? 'eye' : 'eye-off'}
              size={17}
            />
          </Pressable>
        ) : value || errorMessage ? (
          <Feather
            color={statusIconColor}
            name={errorMessage ? 'alert-circle' : 'check-circle'}
            size={17}
          />
        ) : null}
      </View>
      {errorMessage ? <Text style={ultiHumanFeedback.errorText}>{`* ${errorMessage}`}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  eyeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: spacing(36),
    minWidth: spacing(36),
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: 'rgba(3, 86, 158, 0.13)',
    borderColor: 'rgba(3, 86, 158, 0.26)',
    borderRadius: spacing(16),
    borderWidth: 1,
    height: spacing(32),
    justifyContent: 'center',
    width: spacing(32),
  },
  iconFrameActive: {
    backgroundColor: reactNativeColorScheme.ultiHuman.accent,
    borderColor: reactNativeColorScheme.ultiHuman.accentPressed,
  },
  input: {
    color: ultiHumanColors.text,
    flex: 1,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(15),
    lineHeight: spacing(21),
    padding: 0,
    textAlign: 'left',
  },
  inputWrap: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.raised,
    borderColor: 'rgba(3, 86, 158, 0.28)',
    borderRadius: spacing(16),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(10),
    minHeight: spacing(58),
    paddingHorizontal: spacing(12),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.26,
    shadowRadius: spacing(16),
  },
  inputWrapActive: {
    borderColor: reactNativeColorScheme.ultiHuman.accentPressed,
    shadowOpacity: 0.42,
  },
  inputWrapError: {
    borderColor: reactNativeColorScheme.status.danger.strong,
  },
  label: {
    color: ultiHumanColors.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(15),
    letterSpacing: 0,
    lineHeight: spacing(20),
  },
  labelActive: {
    color: reactNativeColorScheme.ultiHuman.accentPressed,
  },
  wrapper: {
    gap: spacing(7),
    width: '100%',
  },
});
