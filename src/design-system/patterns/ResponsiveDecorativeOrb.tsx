import { useMemo } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type HorizontalEdge = 'left' | 'right';
type VerticalEdge = 'bottom' | 'top';

interface ResponsiveDecorativeOrbProps {
  color: string;
  edge: HorizontalEdge;
  maxSize?: number;
  minSize?: number;
  overflowRatio?: number;
  sizeRatio?: number;
  style?: StyleProp<ViewStyle>;
  verticalEdge: VerticalEdge;
  verticalRatio?: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const ResponsiveDecorativeOrb = ({
  color,
  edge,
  maxSize = 240,
  minSize = 160,
  overflowRatio = 0.32,
  sizeRatio = 0.54,
  style,
  verticalEdge,
  verticalRatio = 0.08,
}: ResponsiveDecorativeOrbProps) => {
  const { height, width } = useWindowDimensions();
  const orbStyle = useMemo(() => {
    const size = clamp(width * sizeRatio, minSize, maxSize);
    const horizontalOffset = -size * overflowRatio;
    const verticalOffset = height * verticalRatio;

    return {
      backgroundColor: color,
      borderRadius: size / 2,
      height: size,
      width: size,
      ...(edge === 'left' ? { left: horizontalOffset } : { right: horizontalOffset }),
      ...(verticalEdge === 'top' ? { top: verticalOffset } : { bottom: verticalOffset }),
    };
  }, [
    color,
    edge,
    height,
    maxSize,
    minSize,
    overflowRatio,
    sizeRatio,
    verticalEdge,
    verticalRatio,
    width,
  ]);

  return <View pointerEvents="none" style={[styles.orb, orbStyle, style]} />;
};

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
  },
});
