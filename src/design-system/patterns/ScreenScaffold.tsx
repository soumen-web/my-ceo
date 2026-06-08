import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/useAppTheme';
import { spacing } from '@/utils/scale';

interface ScreenScaffoldProps {
  bottomPadding?: number;
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  safeAreaStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
}

export const ScreenScaffold = ({
  bottomPadding = 24,
  children,
  contentContainerStyle,
  safeAreaStyle,
  scrollable = false,
}: ScreenScaffoldProps) => {
  const theme = useAppTheme();
  const bottomPaddingStyle = bottomPadding > 0 ? { paddingBottom: spacing(bottomPadding) } : null;

  if (scrollable) {
    return (
      <SafeAreaView
        edges={['top', 'right', 'left', 'bottom']}
        style={[styles.safeArea, { backgroundColor: theme.colors.background }, safeAreaStyle]}
      >
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scrollContent, contentContainerStyle, bottomPaddingStyle]}
          style={styles.scrollView}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top', 'right', 'left', 'bottom']}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }, safeAreaStyle]}
    >
      <View style={[styles.content, contentContainerStyle, bottomPaddingStyle]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
});
