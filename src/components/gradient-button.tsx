import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme, semanticColorTokens } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

interface GradientButtonProps {
  label: string;
  arrowColor?: string;
  disabled?: boolean;
  labelColor?: string;
  loading?: boolean;
  onPress?: (() => void) | undefined;
  showArrow?: boolean;
  style?: StyleProp<ViewStyle>;
}

const buttonGradientColors = [
  reactNativeColorScheme.brand[400],
  semanticColorTokens.light.primary,
  semanticColorTokens.light.primaryPressed,
] as const;

const disabledGradientColors = [
  reactNativeColorScheme.ultiHuman.accentDisabled,
  reactNativeColorScheme.ultiHuman.accentDisabled,
] as const;

export const GradientButton = ({
  arrowColor = reactNativeColorScheme.text.inverse,
  disabled = false,
  label,
  labelColor = reactNativeColorScheme.text.inverse,
  loading = false,
  onPress,
  showArrow = false,
  style,
}: GradientButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonWrap,
        style,
        pressed && !isDisabled ? styles.buttonPressed : undefined,
        isDisabled ? styles.buttonWrapDisabled : undefined,
      ]}
    >
      <LinearGradient
        colors={isDisabled ? disabledGradientColors : buttonGradientColors}
        end={{ x: 1, y: 1 }}
        locations={isDisabled ? undefined : [0, 0.48, 1]}
        start={{ x: 0, y: 0 }}
        style={[styles.gradientButton, isDisabled ? styles.gradientButtonDisabled : undefined]}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator color={reactNativeColorScheme.text.inverse} size="small" />
          ) : (
            <>
              <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
              {showArrow ? <Text style={[styles.arrow, { color: arrowColor }]}>→</Text> : null}
            </>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  arrow: {
    color: reactNativeColorScheme.text.inverse,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(18),
    lineHeight: spacing(22),
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonWrap: {
    alignSelf: 'center',
    borderRadius: radius(28),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(10), width: 0 },
    shadowOpacity: 0.58,
    shadowRadius: spacing(18),
    width: '88%',
  },
  buttonWrapDisabled: {
    opacity: 0.74,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(10),
    justifyContent: 'center',
  },
  gradientButton: {
    alignItems: 'center',
    borderRadius: radius(28),
    minHeight: spacing(54),
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  gradientButtonDisabled: {
    opacity: 1,
  },
  label: {
    color: reactNativeColorScheme.text.inverse,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(18),
    textAlign: 'center',
  },
});
