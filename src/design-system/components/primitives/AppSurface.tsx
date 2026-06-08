import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Surface, type SurfaceProps } from 'react-native-paper';

import { radius } from '@design-system/tokens/radius';
import { spacing } from '@design-system/tokens/spacing';

interface AppSurfaceProps extends SurfaceProps {
  children: ReactNode;
  padded?: boolean;
}

export const AppSurface = ({
  children,
  elevation = 1,
  padded = false,
  style,
  ...props
}: AppSurfaceProps) => (
  <Surface
    elevation={elevation}
    style={[styles.surface, padded ? styles.padded : null, style]}
    {...props}
  >
    {children}
  </Surface>
);

const styles = StyleSheet.create({
  padded: {
    padding: spacing.lg,
  },
  surface: {
    borderRadius: radius.lg,
  },
});
