import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { PremiumAnimatedView, premiumMotionTiming } from '@/design-system/components';
import { useKeyboardBottomInset } from '@/design-system/hooks';

interface KeyboardAwareBottomSheetViewProps {
  children: ReactNode;
  closedAndroidBottomInset?: number;
  containerStyle?: StyleProp<ViewStyle>;
  extraOffset?: number;
  includeClosedAndroidSafeArea?: boolean;
  sheetStyle?: StyleProp<ViewStyle>;
}

export const KeyboardAwareBottomSheetView = ({
  children,
  closedAndroidBottomInset = 0,
  containerStyle,
  extraOffset = 8,
  includeClosedAndroidSafeArea = false,
  sheetStyle,
}: KeyboardAwareBottomSheetViewProps) => {
  const { bottomInset, insets, keyboardVisible } = useKeyboardBottomInset({ extraOffset });
  const androidBottomSpace =
    Platform.OS === 'android'
      ? keyboardVisible
        ? bottomInset
        : includeClosedAndroidSafeArea
          ? insets.bottom
          : closedAndroidBottomInset
      : 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
      pointerEvents="box-none"
      style={[styles.container, containerStyle]}
    >
      <PremiumAnimatedView
        distance={16}
        duration={premiumMotionTiming.card}
        style={[
          sheetStyle,
          Platform.OS === 'android' ? { marginBottom: androidBottomSpace } : null,
        ]}
      >
        {children}
      </PremiumAnimatedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
