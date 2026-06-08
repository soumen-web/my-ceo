import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';

import { appIcons, type AppIconName } from './catalog';

export interface AppIconProps {
  accessibilityLabel?: string;
  color?: string;
  name: AppIconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const AppIcon = ({
  accessibilityLabel,
  color,
  name,
  size = 24,
  style,
}: AppIconProps) => {
  const theme = useTheme();

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessible={Boolean(accessibilityLabel)}
      style={style}
    >
      <Icon
        color={color ?? theme.colors.onSurfaceVariant}
        source={appIcons[name]}
        size={size}
      />
    </View>
  );
};
