import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppFonts } from "@/assets/fonts";
import { useKeyboardBottomInset } from "@/design-system/hooks";
import { KeyboardAwareBottomSheetView } from "@/design-system/patterns";
import { reactNativeColorScheme } from "@/design-system/tokens/colors";
import { fontSize, spacing } from "@/utils/scale";

import { AuthLogo } from "./AuthLogo";

const authGradientColors = [
  reactNativeColorScheme.ultiHuman.backgroundGradientStart,
  reactNativeColorScheme.ultiHuman.backgroundGradientMiddle,
  reactNativeColorScheme.ultiHuman.backgroundGradientEnd,
] as const;

interface AuthMobileShellProps {
  children: ReactNode;
  subtitle: string;
  title: string;
}

export const AuthMobileShell = ({
  children,
  subtitle,
  title,
}: AuthMobileShellProps) => {
  const { keyboardHeight, keyboardVisible } = useKeyboardBottomInset({
    extraOffset: spacing(8),
  });

  const androidHeroStyle = useMemo(() => {
    if (Platform.OS !== "android" || !keyboardVisible) {
      return null;
    }

    return {
      minHeight: Math.max(spacing(140), spacing(388) - keyboardHeight * 0.72),
    };
  }, [keyboardHeight, keyboardVisible]);

  return (
    <LinearGradient
      colors={authGradientColors}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={styles.screen}
    >
      <StatusBar backgroundColor="transparent" style="light" translucent />
      <View style={[styles.hero, androidHeroStyle]}>
        <SafeAreaView
          edges={["top", "left", "right"]}
          style={styles.heroSafeArea}
        >
          <View style={styles.heroCopy}>
            <AuthLogo />
            <View style={styles.copyBlock}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <KeyboardAwareBottomSheetView
        containerStyle={styles.sheetOverlay}
        extraOffset={spacing(8)}
        sheetStyle={styles.sheetWrap}
      >
        <ScrollView
          automaticallyAdjustKeyboardInsets={false}
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "on-drag"
          }
          keyboardShouldPersistTaps="handled"
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formEntrance}>{children}</View>
        </ScrollView>
      </KeyboardAwareBottomSheetView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  hero: {
    flex: 0,
    minHeight: spacing(388),
    overflow: "hidden",
    marginTop: spacing(70),
  },
  heroCopy: {
    alignItems: "center",
    flex: 1,
    gap: spacing(18),
    justifyContent: "center",
    paddingHorizontal: spacing(22),
    paddingBottom: spacing(54),
    paddingTop: spacing(18),
  },
  heroSafeArea: {
    flex: 1,
  },
  formEntrance: {
    width: "100%",
  },
  scroll: {
    backgroundColor: "transparent",
    overflow: "visible",
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    backgroundColor: "transparent",
    flexGrow: 1,
    overflow: "visible",
  },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetWrap: {
    marginTop: -spacing(52),
    width: "100%",
  },
  copyBlock: {
    alignItems: "center",
    gap: spacing(8),
    width: "100%",
  },
  subtitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(16),
    lineHeight: spacing(22),
    opacity: 0.74,
    textAlign: "center",
  },
  title: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(34),
    lineHeight: spacing(40),
    textAlign: "center",
    marginTop: spacing(20),
  },
});
