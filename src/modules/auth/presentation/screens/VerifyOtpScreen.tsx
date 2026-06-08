import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { GradientButton } from '@/components/gradient-button';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { ROUTES, type RootStackParamList } from '@/navigation/route-types';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { fontSize, radius, spacing } from '@/utils/scale';
import { observabilityEvents } from '@services/observability/events';
import { useScreenTelemetry } from '@services/observability/performance/useScreenTelemetry';

import { AuthCurvedBottomSheet } from '../components/AuthCurvedBottomSheet';
import { AuthMobileShell } from '../components/AuthMobileShell';
import { useRequestOtpViewModel } from '../hooks/useRequestOtpViewModel';
import { useVerifyOtpViewModel } from '../hooks/useVerifyOtpViewModel';

const OTP_LENGTH = 4;
const RESEND_SECONDS = 60;

type VerifyOtpScreenProps = NativeStackScreenProps<RootStackParamList, 'VerifyOtp'>;

const formatSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const buildOtpDigits = (otp: string | undefined): string[] => {
  const normalizedOtp = otp?.replace(/\D/g, '').slice(0, OTP_LENGTH) ?? '';

  return Array.from({ length: OTP_LENGTH }, (_, index) => normalizedOtp[index] ?? '');
};

export const VerifyOtpScreen = ({ navigation, route }: VerifyOtpScreenProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { email, otp } = route.params;
  const [otpDigits, setOtpDigits] = useState<string[]>(() => buildOtpDigits(otp));
  const [focusedOtpIndex, setFocusedOtpIndex] = useState<number | null>(null);
  const [localError, setLocalError] = useState<string | undefined>();
  const [secondsRemaining, setSecondsRemaining] = useState(RESEND_SECONDS);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { errorMessage, isPending, verifyOtp } = useVerifyOtpViewModel();
  const handleOtpSent = useCallback((result: { otp?: string }) => {
    if (!result.otp) {
      return;
    }

    setOtpDigits(buildOtpDigits(result.otp));
    setLocalError(undefined);
  }, []);
  const { isPending: isResendPending, requestOtp } = useRequestOtpViewModel(handleOtpSent);
  const otpValue = otpDigits.join('');

  useScreenTelemetry('VerifyOtp', observabilityEvents.screenSignInViewed);

  useEffect(() => {
    if (isAuthenticated) {
      if (__DEV__) {
        console.info('[Auth Navigation] OTP verified, navigating to Dashboard');
      }

      navigation.replace(ROUTES.appDrawer, {
        params: { screen: ROUTES.tabHome },
        screen: ROUTES.appTabs,
      });
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setSecondsRemaining((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [secondsRemaining]);

  const focusOtpInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const dismissOtpKeyboard = () => {
    inputRefs.current.forEach((inputRef) => inputRef?.blur());
    Keyboard.dismiss();
  };

  const handleOtpChange = (index: number, value: string) => {
    const normalizedValue = value.replace(/\D/g, '');

    if (!normalizedValue) {
      const nextDigits = [...otpDigits];
      nextDigits[index] = '';
      setOtpDigits(nextDigits);
      return;
    }

    if (normalizedValue.length > 1) {
      const nextDigits = Array.from({ length: OTP_LENGTH }, (_, digitIndex) =>
        normalizedValue[digitIndex] ?? '',
      );
      setOtpDigits(nextDigits);
      setLocalError(undefined);

      if (nextDigits.every(Boolean)) {
        dismissOtpKeyboard();
        return;
      }

      focusOtpInput(Math.min(normalizedValue.length, OTP_LENGTH) - 1);
      return;
    }

    const nextDigits = [...otpDigits];
    nextDigits[index] = normalizedValue;
    setOtpDigits(nextDigits);
    setLocalError(undefined);

    if (nextDigits.every(Boolean)) {
      dismissOtpKeyboard();
      return;
    }

    if (index < OTP_LENGTH - 1) {
      focusOtpInput(index + 1);
    }
  };

  const handleOtpKeyPress = (index: number, key: string) => {
    if (key !== 'Backspace' || otpDigits[index] || index === 0) {
      return;
    }

    focusOtpInput(index - 1);
  };

  const handleSubmit = () => {
    if (isPending) {
      return;
    }

    if (otpValue.length !== OTP_LENGTH) {
      setLocalError('Please enter the 4 digit OTP.');
      return;
    }

    dismissOtpKeyboard();
    void verifyOtp(email, otpValue);
  };

  const handleResendOtp = () => {
    if (secondsRemaining > 0 || isResendPending) {
      return;
    }

    setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''));
    setLocalError(undefined);
    setSecondsRemaining(RESEND_SECONDS);
    void requestOtp(email);
    focusOtpInput(0);
  };

  const visibleError = localError ?? errorMessage;

  return (
    <AuthMobileShell
      subtitle="Enter the 4 digit code sent to your email"
      title="Verify OTP"
    >
      <AuthCurvedBottomSheet>
        <View style={styles.form}>
          <View style={styles.sentRow}>
            <Text style={styles.sentText} numberOfLines={2}>
              Code sent to <Text style={styles.sentEmail}>{email}</Text>
            </Text>
            <Pressable
              accessibilityLabel="Change email address"
              accessibilityRole="button"
              hitSlop={10}
              onPress={() => navigation.replace(ROUTES.signIn)}
              style={({ pressed }) => [
                styles.textButton,
                pressed ? styles.textButtonPressed : undefined,
              ]}
            >
              <Text style={styles.changeEmailText}>Change email</Text>
            </Pressable>
          </View>

          <View style={styles.otpRow}>
            {otpDigits.map((digit, index) => (
              <TextInput
                accessibilityLabel={`OTP digit ${index + 1}`}
                autoComplete="one-time-code"
                inputMode="numeric"
                key={`otp-${String(index)}`}
                ref={(inputRef) => {
                  inputRefs.current[index] = inputRef;
                }}
                autoFocus={index === 0}
                keyboardType="number-pad"
                maxLength={OTP_LENGTH}
                onChangeText={(value) => handleOtpChange(index, value)}
                onBlur={() => setFocusedOtpIndex(null)}
                onFocus={() => setFocusedOtpIndex(index)}
                onKeyPress={({ nativeEvent }) => handleOtpKeyPress(index, nativeEvent.key)}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                selectionColor={reactNativeColorScheme.ultiHuman.accentPressed}
                style={[
                  styles.otpInput,
                  focusedOtpIndex === index ? styles.otpInputFocused : undefined,
                  digit ? styles.otpInputFilled : undefined,
                  visibleError ? styles.otpInputError : undefined,
                ]}
                textContentType="oneTimeCode"
                value={digit}
              />
            ))}
          </View>

          {visibleError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{visibleError}</Text>
            </View>
          ) : null}

          <GradientButton
            label="VERIFY"
            loading={isPending}
            onPress={handleSubmit}
            style={styles.submitButton}
          />

          {secondsRemaining > 0 ? (
            <Text style={styles.resendText}>
              Resend OTP in{' '}
              <Text style={styles.resendTime}>{formatSeconds(secondsRemaining)}</Text>
            </Text>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ busy: isResendPending, disabled: isResendPending }}
              disabled={isResendPending}
              hitSlop={10}
              onPress={handleResendOtp}
              style={({ pressed }) => [
                styles.textButton,
                pressed && !isResendPending ? styles.textButtonPressed : undefined,
              ]}
            >
              <Text style={styles.resendLink}>
                {isResendPending ? 'Sending OTP...' : 'Resend OTP'}
              </Text>
            </Pressable>
          )}
        </View>
      </AuthCurvedBottomSheet>
    </AuthMobileShell>
  );
};

const styles = StyleSheet.create({
  changeEmailText: {
    color: reactNativeColorScheme.ultiHuman.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  errorBanner: {
    backgroundColor: reactNativeColorScheme.status.danger.background,
    borderRadius: radius(8),
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(10),
    width: '100%',
  },
  errorText: {
    color: reactNativeColorScheme.status.danger.foreground,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
    textAlign: 'center',
  },
  form: {
    alignItems: 'center',
    gap: spacing(20),
    width: '100%',
  },
  otpInput: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassAction,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(12),
    borderWidth: 1,
    color: reactNativeColorScheme.ultiHuman.text,
    flex: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(22),
    height: spacing(54),
    maxWidth: spacing(58),
    minWidth: spacing(48),
    padding: 0,
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(6), width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: spacing(10),
    textAlign: 'center',
  },
  otpInputError: {
    borderColor: reactNativeColorScheme.status.danger.strong,
  },
  otpInputFilled: {
    borderColor: reactNativeColorScheme.ultiHuman.accentPressed,
  },
  otpInputFocused: {
    borderColor: reactNativeColorScheme.ultiHuman.accent,
    shadowOpacity: 0.34,
  },
  otpRow: {
    flexDirection: 'row',
    gap: spacing(8),
    justifyContent: 'center',
    width: '100%',
  },
  resendLink: {
    color: reactNativeColorScheme.ultiHuman.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    textAlign: 'center',
  },
  resendText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    textAlign: 'center',
  },
  resendTime: {
    color: reactNativeColorScheme.ultiHuman.accentPressed,
    fontFamily: AppFonts.googleSansBold,
  },
  sentEmail: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
  },
  sentRow: {
    alignItems: 'center',
    gap: spacing(7),
    width: '100%',
  },
  sentText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing(4),
  },
  textButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: spacing(28),
    paddingHorizontal: spacing(8),
  },
  textButtonPressed: {
    opacity: 0.68,
  },
});
