import { Image as ExpoImage } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { semanticColorTokens } from '@/design-system/tokens/colors';
import { radius, spacing } from '@/utils/scale';

export const ULTIHUMAN_BRAND_NAME = 'MyCEO';
export const ULTIHUMAN_HEADER_TEXT = 'MyCEO';
export const ULTIHUMAN_TAGLINE = 'A National Award Winning Company';

const webskittersLogo = require('../../assets/brand/webskitters-logo.png');
const webskittersHeaderLogo = require('../../assets/brand/webskitters-header-logo.png');
const webskittersSplashLogo = require('../../assets/brand/webskitters-splash-logo.png');

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type LogoVariant = 'mark' | 'full' | 'hero';

interface UltiHumanLogoProps {
  size?: LogoSize;
  style?: StyleProp<ViewStyle>;
  variant?: LogoVariant;
}

const logoSizeByVariant: Record<LogoSize, number> = {
  xs: spacing(42),
  sm: spacing(52),
  md: spacing(82),
  lg: spacing(132),
  xl: spacing(164),
};

export const UltiHumanLogo = ({
  size = 'md',
  style,
  variant = 'full',
}: UltiHumanLogoProps) => {
  const logoSize = logoSizeByVariant[size];
  const isCompact = variant === 'mark';
  const isHero = variant === 'hero';
  const source = isCompact
    ? webskittersLogo
    : isHero
      ? webskittersSplashLogo
      : webskittersHeaderLogo;

  return (
    <View
      accessibilityLabel={`${ULTIHUMAN_BRAND_NAME} logo`}
      accessibilityRole="image"
      style={[
        isCompact ? styles.logoShell : styles.transparentShell,
        isCompact ? styles.compactShell : undefined,
        {
          borderRadius: isCompact ? radius(10) : 0,
          height: isCompact ? logoSize : Math.round(logoSize * 0.56),
          width: isCompact ? logoSize : Math.round(logoSize * 1.62),
        },
        style,
      ]}
    >
      <ExpoImage
        contentFit="contain"
        source={source}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  compactShell: {
    borderRadius: radius(10),
  },
  logoShell: {
    backgroundColor: semanticColorTokens.dark.background,
    overflow: 'hidden',
  },
  transparentShell: {
    overflow: 'hidden',
  },
});
