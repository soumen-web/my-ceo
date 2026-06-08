import { Dimensions, PixelRatio } from 'react-native';

const FIGMA_BASE_WIDTH = 375;
const PHONE_MAX_SCALE = 1.02;
const PHONE_MIN_SCALE = 0.9;
const TABLET_MAX_SCALE = 1.1;
const TABLET_BREAKPOINT = 550;

const normalize = (size: number, scale?: number): number => {
  const { width } = Dimensions.get('window');

  const baseScale = width / FIGMA_BASE_WIDTH;
  const clampedScale =
    width > TABLET_BREAKPOINT
      ? Math.min(baseScale, TABLET_MAX_SCALE)
      : Math.min(Math.max(baseScale, PHONE_MIN_SCALE), PHONE_MAX_SCALE);
  const multiplier = scale ?? 1;
  const scaledSize = size * clampedScale * multiplier;

  return Math.round(PixelRatio.roundToNearestPixel(scaledSize));
};

export default normalize;
