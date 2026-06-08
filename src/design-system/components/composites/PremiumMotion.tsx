import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  type DimensionValue,
  type PressableProps,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import { reactNativeColorScheme } from '@/design-system/tokens/colors';

interface PremiumAnimatedViewProps {
  children: ReactNode;
  delay?: number;
  disabled?: boolean;
  distance?: number;
  duration?: number;
  scaleFrom?: number;
  style?: StyleProp<ViewStyle>;
}

interface PremiumPressableProps extends PressableProps {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  pressScale?: number;
}

interface PremiumSkeletonProps {
  height?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export const premiumMotionTiming = {
  badge: 260,
  card: 340,
  press: 150,
  screen: 380,
  section: 280,
} as const;

export const PremiumAnimatedView = ({
  children,
  style,
}: PremiumAnimatedViewProps) => {
  return <View style={style}>{children}</View>;
};

export const PremiumPressable = ({
  children,
  contentStyle,
  disabled = false,
  pressScale: _pressScale,
  style,
  ...props
}: PremiumPressableProps) => {
  void _pressScale;

  const mergedStyle: PressableProps['style'] =
    typeof style === 'function'
      ? (state) => [style(state), contentStyle]
      : [style, contentStyle];

  return (
    <Pressable {...props} disabled={disabled} style={mergedStyle}>
      {children}
    </Pressable>
  );
};

export const PremiumSkeleton = ({
  height,
  radius = 8,
  style,
}: PremiumSkeletonProps) => {
  return (
    <View
      style={[
        styles.skeleton,
        { borderRadius: radius },
        height ? { height } : undefined,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassSoft,
    overflow: 'hidden',
  },
});
