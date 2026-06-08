import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { UltiHumanLogo } from '@/components/brand';
import { radius, spacing } from '@/utils/scale';

type AuthLogoMarkSize = 'lg' | 'xl';

interface AuthLogoProps {
  markSize?: AuthLogoMarkSize;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const AuthLogo = ({
  markSize = 'xl',
  size = spacing(164),
  style,
}: AuthLogoProps) => (
  <View
    accessibilityLabel="MyCEO Webskitters logo"
    accessibilityRole="image"
    style={[
      styles.wrapper,
      {
        borderRadius: radius(20),
        height: size,
        width: size,
      },
      style,
    ]}
  >
    <UltiHumanLogo size={markSize} variant="mark" />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
