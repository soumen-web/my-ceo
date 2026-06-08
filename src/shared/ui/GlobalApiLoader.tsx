import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { UltiHumanLogo } from '@/components/brand';
import { useReducedMotionPreference } from '@/design-system/hooks';
import { reactNativeColorScheme, semanticColorTokens } from '@/design-system/tokens/colors';
import { spacing } from '@/utils/scale';
import { globalLoaderService } from '@/services/ui/globalLoader/globalLoaderService';

export const GlobalApiLoader = () => {
  const isVisible = useSyncExternalStore(
    globalLoaderService.subscribe,
    globalLoaderService.getSnapshot,
  );
  const reduceMotionEnabled = useReducedMotionPreference();
  const [spinValue] = useState(() => new Animated.Value(0));
  const spin = useMemo(
    () => spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    }),
    [spinValue],
  );

  useEffect(() => {
    if (!isVisible || reduceMotionEnabled) {
      spinValue.stopAnimation();
      spinValue.setValue(0);
      return undefined;
    }

    spinValue.setValue(0);
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        duration: 1150,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [isVisible, reduceMotionEnabled, spinValue]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.wheelWrap}>
        <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]} />
        <View style={styles.innerCircle}>
          <UltiHumanLogo size="xs" variant="mark" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  innerCircle: {
    alignItems: 'center',
    backgroundColor: semanticColorTokens.light.surfaceStrong,
    borderRadius: spacing(29),
    height: spacing(58),
    justifyContent: 'center',
    position: 'absolute',
    width: spacing(58),
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: semanticColorTokens.light.scrim,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 999,
  },
  spinnerRing: {
    borderBottomColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderSoft,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderSoft,
    borderLeftColor: 'transparent',
    borderRadius: spacing(46),
    borderRightColor: reactNativeColorScheme.ultiHuman.accent,
    borderTopColor: reactNativeColorScheme.ultiHuman.accentPressed,
    borderWidth: spacing(6),
    height: spacing(92),
    width: spacing(92),
  },
  wheelWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
