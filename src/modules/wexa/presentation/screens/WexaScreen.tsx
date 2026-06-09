import { Feather } from "@expo/vector-icons";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { AppFonts } from "@/assets/fonts";
import { UltiHumanLogo } from "@/components/brand";
import { PremiumPressable } from "@/design-system/components";
import { useReducedMotionPreference } from "@/design-system/hooks";
import { MobileScreenShell } from "@/design-system/patterns/MobileScreenShell";
import { reactNativeColorScheme } from "@/design-system/tokens/colors";
import { toAuthenticatedUserViewModel, useAuthSession } from "@/modules/auth";
import { DashboardShellHeader } from "@/modules/home/presentation/components/DashboardShellHeader";
import { ROUTES, type AppTabParamList } from "@/navigation/route-types";
import { fontSize, radius, spacing } from "@/utils/scale";

type WexaScreenProps = BottomTabScreenProps<AppTabParamList, "TabWexa">;
type AttachmentType = "media" | null;
type AttachmentMenuItem = {
  divider?: boolean;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  trailing?: boolean;
};

const attachmentMenuItems: AttachmentMenuItem[] = [
  { icon: "paperclip", label: "Add photos & videos" },
  { icon: "file-text", label: "Recent files", trailing: true },
  { divider: true, icon: "image", label: "Create image" },
  { icon: "send", label: "Deep research" },
  { icon: "globe", label: "Web search" },
  { icon: "more-horizontal", label: "More", trailing: true },
] as const;

const initialsFrom = (value: string | undefined): string => {
  const parts = value?.trim().split(/\s+/).filter(Boolean) ?? [];

  return parts.length
    ? parts
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "W";
};

export const WexaScreen = ({ navigation }: WexaScreenProps) => {
  const reduceMotionEnabled = useReducedMotionPreference();
  const [prompt, setPrompt] = useState("");
  const [attachmentType, setAttachmentType] = useState<AttachmentType>(null);
  const [attachmentMenuVisible, setAttachmentMenuVisible] = useState(false);
  const heroProgress = useSharedValue(reduceMotionEnabled ? 1 : 0);
  const logoProgress = useSharedValue(reduceMotionEnabled ? 1 : 0);
  const composerGlowProgress = useSharedValue(reduceMotionEnabled ? 1 : 0);
  const heroEnterDistance = spacing(10);
  const logoEnterDistance = spacing(12);
  const { user } = useAuthSession();
  const userViewModel = toAuthenticatedUserViewModel(user);
  const displayName = userViewModel?.displayName ?? "Employee";
  const canSubmit = useMemo(
    () => prompt.trim().length > 0 || attachmentType !== null,
    [attachmentType, prompt],
  );

  useEffect(() => {
    heroProgress.value = reduceMotionEnabled
      ? 1
      : withTiming(1, {
          duration: 320,
          easing: Easing.out(Easing.cubic),
        });

    logoProgress.value = reduceMotionEnabled
      ? 1
      : withDelay(
          80,
          withTiming(1, {
            duration: 420,
            easing: Easing.out(Easing.back(1.12)),
          }),
        );

    composerGlowProgress.value = reduceMotionEnabled
      ? 1
      : withDelay(
          120,
          withTiming(1, {
            duration: 500,
            easing: Easing.out(Easing.cubic),
          }),
        );
  }, [composerGlowProgress, heroProgress, logoProgress, reduceMotionEnabled]);

  const heroAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heroProgress.value,
    transform: [
      { translateY: (1 - heroProgress.value) * heroEnterDistance },
      { scale: 0.985 + heroProgress.value * 0.015 },
    ],
  }));

  const composerGlowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 0.28 + composerGlowProgress.value * 0.36,
    transform: [{ scale: 0.97 + composerGlowProgress.value * 0.03 }],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoProgress.value,
    transform: [
      { translateY: (1 - logoProgress.value) * logoEnterDistance },
      { scale: 0.88 + logoProgress.value * 0.12 },
    ],
  }));

  const openNotifications = useCallback(() => {
    navigation.navigate(ROUTES.tabMyDesk, { screen: ROUTES.notifications });
  }, [navigation]);

  const submitPrompt = useCallback(() => {
    if (!canSubmit) {
      return;
    }

    setPrompt("");
    setAttachmentType(null);
    setAttachmentMenuVisible(false);
  }, [canSubmit]);

  const selectAttachmentMenuItem = useCallback((label: string) => {
    if (label === "Add photos & videos" || label === "Recent files") {
      setAttachmentType("media");
    }

    setAttachmentMenuVisible(false);
  }, []);

  return (
    <MobileScreenShell
      contentContainerStyle={styles.screenContent}
      header={
        <DashboardShellHeader
          initials={initialsFrom(displayName)}
          onNotificationPress={openNotifications}
          subtitle="Agentic AI assistant"
          title="Wexa"
        />
      }
      keyboardAware
      scrollBounces={false}
      scrollEnabled={false}
    >
      <Animated.View style={[styles.heroWrap, heroAnimatedStyle]}>
        <Animated.View style={[styles.heroLogoFrame, logoAnimatedStyle]}>
          <UltiHumanLogo size="xl" style={styles.heroLogo} variant="wexa" />
        </Animated.View>
        <Text style={styles.heroEyebrow}>Wexa AI</Text>
        <Text style={styles.heroTitle}>How can I help you today?</Text>
      </Animated.View>

      <View style={styles.composerWrap}>
        {attachmentMenuVisible ? (
          <View style={styles.attachmentMenu}>
            {attachmentMenuItems.map((item) => (
              <PremiumPressable
                accessibilityLabel={item.label}
                accessibilityRole="button"
                key={item.label}
                onPress={() => selectAttachmentMenuItem(item.label)}
                pressScale={0.98}
                style={({ pressed }) => [
                  styles.attachmentMenuItem,
                  item.divider ? styles.attachmentMenuItemDivider : undefined,
                  pressed ? styles.menuItemPressed : undefined,
                ]}
              >
                <Feather
                  color={reactNativeColorScheme.text.primary}
                  name={item.icon}
                  size={spacing(17)}
                />
                <Text style={styles.attachmentMenuText}>{item.label}</Text>
                {item.trailing ? (
                  <Feather
                    color={reactNativeColorScheme.text.primary}
                    name="chevron-right"
                    size={spacing(17)}
                  />
                ) : null}
              </PremiumPressable>
            ))}
          </View>
        ) : null}

        {attachmentType ? (
          <View style={styles.attachmentPill}>
            <Feather color="#f2f2f2" name="paperclip" size={spacing(14)} />
            <Text style={styles.attachmentText}>Photo/video ready</Text>
            <PremiumPressable
              accessibilityLabel="Remove attachment"
              accessibilityRole="button"
              onPress={() => setAttachmentType(null)}
              style={styles.removeAttachmentButton}
            >
              <Feather
                color={reactNativeColorScheme.text.muted}
                name="x"
                size={spacing(13)}
              />
            </PremiumPressable>
          </View>
        ) : null}

        <LinearGradient
          colors={[
            "rgba(16, 51, 91, 0.94)",
            "rgba(9, 32, 62, 0.9)",
            "rgba(5, 22, 43, 0.92)",
          ]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.composer}
        >
          <Animated.View
            pointerEvents="none"
            style={[styles.composerGlow, composerGlowAnimatedStyle]}
          />
          <PremiumPressable
            accessibilityLabel="Open upload menu"
            accessibilityRole="button"
            accessibilityState={
              attachmentMenuVisible ? { expanded: true } : undefined
            }
            onPress={() => setAttachmentMenuVisible((isVisible) => !isVisible)}
            pressScale={0.94}
            style={({ pressed }) => [
              styles.plusButton,
              attachmentMenuVisible ? styles.plusButtonActive : undefined,
              pressed ? styles.pressed : undefined,
            ]}
          >
            <Feather
              color={reactNativeColorScheme.text.primary}
              name="plus"
              size={spacing(24)}
            />
          </PremiumPressable>

          <TextInput
            accessibilityLabel="Ask Wexa"
            allowFontScaling
            onChangeText={setPrompt}
            placeholder="Ask anything"
            placeholderTextColor={reactNativeColorScheme.text.muted}
            returnKeyType="send"
            selectionColor={reactNativeColorScheme.ultiHuman.accent}
            style={styles.input}
            value={prompt}
          />

          <PremiumPressable
            accessibilityLabel="Record voice prompt"
            accessibilityRole="button"
            pressScale={0.94}
            style={({ pressed }) => [
              styles.micButton,
              pressed ? styles.pressed : undefined,
            ]}
          >
            <Feather
              color={reactNativeColorScheme.text.primary}
              name="mic"
              size={spacing(20)}
            />
          </PremiumPressable>

          <PremiumPressable
            accessibilityLabel="Submit to Wexa"
            accessibilityRole="button"
            accessibilityState={canSubmit ? undefined : { disabled: true }}
            disabled={!canSubmit}
            onPress={submitPrompt}
            pressScale={0.94}
            style={({ pressed }) => [
              styles.waveButton,
              !canSubmit ? styles.waveButtonIdle : undefined,
              pressed ? styles.pressed : undefined,
            ]}
          >
            <Feather
              color={
                canSubmit
                  ? reactNativeColorScheme.text.inverse
                  : reactNativeColorScheme.text.disabled
              }
              name="arrow-up"
              size={spacing(22)}
            />
          </PremiumPressable>
        </LinearGradient>
      </View>
    </MobileScreenShell>
  );
};

const styles = StyleSheet.create({
  attachmentPill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: reactNativeColorScheme.ultiHuman.glassSurface,
    borderColor: reactNativeColorScheme.ultiHuman.glassBorder,
    borderRadius: radius(99),
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing(7),
    marginTop: spacing(10),
    paddingLeft: spacing(10),
    paddingRight: spacing(5),
    paddingVertical: spacing(6),
  },
  attachmentMenu: {
    alignSelf: "flex-start",
    backgroundColor: reactNativeColorScheme.ultiHuman.inputGlassSurface,
    borderColor: reactNativeColorScheme.ultiHuman.glassBorder,
    borderRadius: radius(14),
    borderWidth: 1,
    marginBottom: spacing(2),
    overflow: "hidden",
    paddingVertical: spacing(8),
    shadowColor: "#000000",
    shadowOffset: { height: spacing(14), width: 0 },
    shadowOpacity: 0.32,
    shadowRadius: spacing(22),
    width: spacing(228),
  },
  attachmentMenuItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing(12),
    minHeight: spacing(36),
    paddingHorizontal: spacing(16),
  },
  attachmentMenuItemDivider: {
    borderTopColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderSoft,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: spacing(6),
    paddingTop: spacing(8),
  },
  attachmentMenuText: {
    color: reactNativeColorScheme.text.primary,
    flex: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  attachmentText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  composer: {
    alignItems: "center",
    borderColor: reactNativeColorScheme.ultiHuman.glassBorder,
    borderRadius: radius(999),
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing(7),
    minHeight: spacing(50),
    overflow: "hidden",
    paddingLeft: spacing(6),
    paddingRight: spacing(6),
    paddingVertical: spacing(4),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.34,
    shadowRadius: spacing(20),
  },
  composerGlow: {
    backgroundColor: "rgba(123, 204, 255, 0.08)",
    bottom: -spacing(18),
    left: spacing(20),
    position: "absolute",
    right: spacing(20),
    top: -spacing(18),
  },
  composerWrap: {
    width: "100%",
  },
  heroEyebrow: {
    color: reactNativeColorScheme.text.muted,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    marginTop: spacing(4),
    textTransform: "uppercase",
  },
  heroLogo: {
    opacity: 0.96,
  },
  heroLogoFrame: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing(6),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(14), width: 0 },
    shadowOpacity: 0.24,
    shadowRadius: spacing(22),
  },
  heroTitle: {
    color: reactNativeColorScheme.text.primary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(25),
    lineHeight: spacing(32),
    marginTop: spacing(5),
    textAlign: "center",
  },
  heroWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing(10),
  },
  input: {
    color: reactNativeColorScheme.text.primary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(15),
    height: spacing(40),
    lineHeight: spacing(20),
    minWidth: 0,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(8),
    flex: 1,
  },
  menuItemPressed: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glass,
  },
  micButton: {
    alignItems: "center",
    borderRadius: radius(999),
    height: spacing(38),
    justifyContent: "center",
    width: spacing(34),
  },
  plusButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.055)",
    borderColor: "rgba(174, 224, 255, 0.22)",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius(999),
    height: spacing(40),
    justifyContent: "center",
    width: spacing(40),
  },
  plusButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.97 }],
  },
  removeAttachmentButton: {
    alignItems: "center",
    borderRadius: radius(99),
    height: spacing(22),
    justifyContent: "center",
    width: spacing(22),
  },
  screenContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: spacing(82),
  },
  waveButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: radius(999),
    height: spacing(40),
    justifyContent: "center",
    width: spacing(40),
  },
  waveButtonIdle: {
    opacity: 0.92,
  },
});
