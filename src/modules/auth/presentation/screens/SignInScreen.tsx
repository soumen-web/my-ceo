import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { GradientButton } from '@/components/gradient-button';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { ROUTES, type RootStackParamList } from '@/navigation/route-types';
import { locationService } from '@/services/location';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/authSlice';
import { fontSize, radius, spacing } from '@/utils/scale';
import { observabilityEvents } from '@services/observability/events';
import { useScreenTelemetry } from '@services/observability/performance/useScreenTelemetry';

import { AuthCurvedBottomSheet } from '../components/AuthCurvedBottomSheet';
import { AuthInputField } from '../components/AuthInputField';
import { AuthMobileShell } from '../components/AuthMobileShell';
import { useRequestOtpViewModel } from '../hooks/useRequestOtpViewModel';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export const SignInScreen = ({ navigation }: SignInScreenProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFocused = useIsFocused();
  const handleOtpSent = useCallback(
    (result: { email: string; otp?: string }) => {
      if (!isFocused) {
        return;
      }

      navigation.navigate(ROUTES.verifyOtp, {
        email: result.email,
        ...(result.otp ? { otp: result.otp } : {}),
      });
    },
    [isFocused, navigation],
  );
  const { errorMessage, isPending, requestOtp } = useRequestOtpViewModel(handleOtpSent);
  const [email, setEmail] = useState('johnwork@newgen.com');
  const [emailError, setEmailError] = useState<string | undefined>();

  useScreenTelemetry('SignIn', observabilityEvents.screenSignInViewed);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace(ROUTES.appDrawer, {
        params: { screen: ROUTES.tabHome },
        screen: ROUTES.appTabs,
      });
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    void locationService.requestLoginLocationPermission();
  }, []);

  const validate = (): boolean => {
    const normalizedEmail = email.trim();
    const nextEmailError = emailPattern.test(normalizedEmail)
      ? undefined
      : 'Please enter a valid email address.';

    setEmailError(nextEmailError);

    return !nextEmailError;
  };

  const handleSubmit = () => {
    if (isPending || !validate()) {
      return;
    }

    void requestOtp(email.trim().toLowerCase());
  };

  return (
    <AuthMobileShell
      subtitle="Your Workforce Hub awaits"
      title="Get Started!"
    >
      <AuthCurvedBottomSheet>
        <View style={styles.form}>
          <AuthInputField
            autoCapitalize="none"
            errorMessage={emailError}
            keyboardType="email-address"
            label="Email"
            onChangeText={(value) => {
              setEmail(value);
              if (emailError) {
                setEmailError(undefined);
              }
            }}
            onSubmitEditing={handleSubmit}
            placeholder="Enter your work email"
            returnKeyType="done"
            textContentType="emailAddress"
            value={email}
          />

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <GradientButton
            label="LOGIN"
            loading={isPending}
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </View>
      </AuthCurvedBottomSheet>
    </AuthMobileShell>
  );
};

const styles = StyleSheet.create({
  errorBanner: {
    backgroundColor: reactNativeColorScheme.status.danger.background,
    borderRadius: radius(8),
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(10),
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
    gap: spacing(18),
    width: '100%',
  },
  submitButton: {
    marginTop: spacing(16),
  },
});
