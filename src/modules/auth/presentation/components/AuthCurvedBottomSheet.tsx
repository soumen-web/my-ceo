import type { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { radius, spacing } from '@/utils/scale';

interface AuthCurvedBottomSheetProps {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const AuthCurvedBottomSheet = ({
  children,
  contentStyle,
  style,
  testID = 'auth-curved-bottom-sheet',
}: AuthCurvedBottomSheetProps) => (
  <SafeAreaView
    edges={['bottom', 'left', 'right']}
    style={[styles.sheet, style]}
    testID={testID}
  >
    <View style={[styles.content, contentStyle]}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  content: {
    gap: spacing(24),
    width: '100%',
  },
  sheet: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.raised,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderTopLeftRadius: radius(52),
    borderTopRightRadius: radius(52),
    borderWidth: 1,
    elevation: 12,
    minHeight: spacing(282),
    paddingHorizontal: spacing(24),
    paddingTop: spacing(40),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: -spacing(10), width: 0 },
    shadowOpacity: 0.35,
    shadowRadius: spacing(22),
    width: '100%',
  },
});
