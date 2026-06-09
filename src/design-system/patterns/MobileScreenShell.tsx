import { useEffect, useRef, type ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { PremiumAnimatedView, premiumMotionTiming } from '@/design-system/components';
import { useKeyboardBottomInset } from '@/design-system/hooks';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { radius, spacing } from '@/utils/scale';

const mobileShellGradient = [
  reactNativeColorScheme.ultiHuman.backgroundGradientStart,
  reactNativeColorScheme.ultiHuman.backgroundGradientMiddle,
  reactNativeColorScheme.ultiHuman.backgroundGradientEnd,
] as const;

interface MobileScreenShellProps {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  header: ReactNode;
  keyboardAware?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  scrollBounces?: boolean;
  scrollEnabled?: boolean;
}

export const MobileScreenShell = ({
  children,
  contentContainerStyle,
  header,
  keyboardAware = false,
  onRefresh,
  refreshing = false,
  scrollBounces = true,
  scrollEnabled = true,
}: MobileScreenShellProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { bottomInset, keyboardVisible } = useKeyboardBottomInset({
    enabled: keyboardAware,
    extraOffset: spacing(16),
  });
  const androidKeyboardPadding =
    keyboardAware && keyboardVisible && Platform.OS === 'android' ? bottomInset : 0;

  useEffect(() => {
    if (!keyboardAware || !keyboardVisible || Platform.OS !== 'android') {
      return undefined;
    }

    const scrollTimer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 80);

    return () => {
      clearTimeout(scrollTimer);
    };
  }, [keyboardAware, keyboardVisible]);

  return (
    <LinearGradient
      colors={mobileShellGradient}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.rootGradient}
    >
      <StatusBar backgroundColor="transparent" style="light" translucent />
      <SafeAreaView
        edges={['top', 'right', 'left', 'bottom']}
        style={styles.safeArea}
      >
        <KeyboardAvoidingView
          behavior={keyboardAware && Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <View style={styles.container}>
            <View style={styles.headerWrap}>{header}</View>
            {scrollEnabled ? (
              <ScrollView
                bounces={scrollBounces}
                contentContainerStyle={[
                  styles.scrollContent,
                  androidKeyboardPadding
                    ? { paddingBottom: spacing(40) + androidKeyboardPadding }
                    : null,
                  contentContainerStyle,
                ]}
                keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                keyboardShouldPersistTaps="handled"
                ref={scrollViewRef}
                refreshControl={
                  onRefresh ? (
                    <RefreshControl
                      colors={[reactNativeColorScheme.ultiHuman.accent]}
                      onRefresh={onRefresh}
                      refreshing={refreshing}
                      tintColor={reactNativeColorScheme.ultiHuman.accent}
                    />
                  ) : undefined
                }
                showsVerticalScrollIndicator={false}
              >
                <PremiumAnimatedView
                  distance={7}
                  duration={premiumMotionTiming.screen}
                  scaleFrom={0.985}
                  style={styles.motionContent}
                >
                  {children}
                </PremiumAnimatedView>
              </ScrollView>
            ) : (
              <View style={[styles.staticContent, contentContainerStyle]}>
                <PremiumAnimatedView
                  distance={7}
                  duration={premiumMotionTiming.screen}
                  scaleFrom={0.985}
                  style={styles.motionStaticContent}
                >
                  {children}
                </PremiumAnimatedView>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing(12),
    paddingHorizontal: spacing(18),
    paddingTop: spacing(8),
  },
  headerWrap: {
    borderRadius: radius(8),
    overflow: 'hidden',
  },
  keyboardContainer: {
    flex: 1,
  },
  motionContent: {
    gap: spacing(18),
  },
  motionStaticContent: {
    flex: 1,
    gap: spacing(18),
  },
  rootGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing(40),
  },
  staticContent: {
    flex: 1,
    paddingBottom: spacing(40),
  },
});
