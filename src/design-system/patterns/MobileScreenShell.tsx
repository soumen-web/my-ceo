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
import { StatusBar } from 'expo-status-bar';

import { PremiumAnimatedView, premiumMotionTiming } from '@/design-system/components';
import { useKeyboardBottomInset } from '@/design-system/hooks';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { radius, spacing } from '@/utils/scale';

import { ScreenScaffold } from './ScreenScaffold';

const mobileShellGradient = [
  '#020914',
  '#061321',
  '#0a1d33',
  '#122e46',
] as const;

const starField = [
  { left: '8%', opacity: 0.3, size: 1, top: '9%' },
  { left: '17%', opacity: 0.18, size: 1, top: '22%' },
  { left: '27%', opacity: 0.34, size: 1.5, top: '12%' },
  { left: '42%', opacity: 0.22, size: 1, top: '26%' },
  { left: '56%', opacity: 0.32, size: 1, top: '8%' },
  { left: '68%', opacity: 0.18, size: 1.5, top: '19%' },
  { left: '79%', opacity: 0.28, size: 1, top: '11%' },
  { left: '91%', opacity: 0.2, size: 1, top: '27%' },
  { left: '12%', opacity: 0.18, size: 1, top: '48%' },
  { left: '36%', opacity: 0.22, size: 1, top: '58%' },
  { left: '63%', opacity: 0.16, size: 1, top: '44%' },
  { left: '86%', opacity: 0.2, size: 1.5, top: '62%' },
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
    <ScreenScaffold
      bottomPadding={0}
      contentContainerStyle={styles.scaffoldContent}
      safeAreaStyle={styles.scaffoldSafeArea}
    >
      <StatusBar backgroundColor={reactNativeColorScheme.ultiHuman.background} style="light" />
      <View style={styles.background}>
        <LinearGradient
          colors={mobileShellGradient}
          end={{ x: 1, y: 0.95 }}
          start={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(74, 182, 255, 0.18)', 'rgba(74, 182, 255, 0.04)', 'rgba(74, 182, 255, 0)']}
          end={{ x: 0.5, y: 1 }}
          pointerEvents="none"
          start={{ x: 0.5, y: 0 }}
          style={styles.skyGlowTop}
        />
        <LinearGradient
          colors={['rgba(123, 204, 255, 0)', 'rgba(123, 204, 255, 0.1)', 'rgba(123, 204, 255, 0)']}
          end={{ x: 1, y: 1 }}
          pointerEvents="none"
          start={{ x: 0, y: 0 }}
          style={styles.skyGlowBottom}
        />
        {starField.map((star) => (
          <View
            key={`${star.left}-${star.top}`}
            pointerEvents="none"
            style={[
              styles.star,
              {
                height: star.size,
                left: star.left,
                opacity: star.opacity,
                top: star.top,
                width: star.size,
              },
            ]}
          />
        ))}
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
                  androidKeyboardPadding ? { paddingBottom: spacing(40) + androidKeyboardPadding } : null,
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
      </View>
    </ScreenScaffold>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    minHeight: '100%',
  },
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
  scaffoldContent: {
    backgroundColor: reactNativeColorScheme.ultiHuman.background,
    flex: 1,
    paddingBottom: 0,
  },
  scaffoldSafeArea: {
    backgroundColor: reactNativeColorScheme.ultiHuman.background,
  },
  skyGlowBottom: {
    bottom: -spacing(120),
    height: spacing(360),
    left: -spacing(80),
    position: 'absolute',
    right: -spacing(80),
  },
  skyGlowTop: {
    height: spacing(260),
    left: -spacing(70),
    position: 'absolute',
    right: -spacing(70),
    top: -spacing(80),
  },
  scrollContent: {
    paddingBottom: spacing(40),
  },
  staticContent: {
    flex: 1,
    paddingBottom: spacing(40),
  },
  star: {
    backgroundColor: 'rgba(237, 248, 255, 0.88)',
    borderRadius: 999,
    position: 'absolute',
  },
});
