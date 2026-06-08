import { Feather } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppFonts } from "@/assets/fonts";
import { useReducedMotionPreference } from "@/design-system/hooks";
import type { AppTabParamList } from "@/navigation/route-types";
import { fontSize, spacing } from "@/utils/scale";

type TabRouteName = keyof AppTabParamList;

const TAB_BAR_HEIGHT = spacing(66);
const TAB_BAR_WIDTH_RATIO = 0.88;
const TAB_BAR_COLLAPSED_WIDTH_RATIO = 0.68;
const TAB_ITEM_HEIGHT = spacing(50);
const ACTIVE_CAPSULE_WIDTH = spacing(84);
const ACTIVE_CAPSULE_COLLAPSED_WIDTH = spacing(40);
const ACTIVE_CAPSULE_HEIGHT = spacing(36);
const PILL_RADIUS = 999;
const ACTIVE_LABEL_GAP = spacing(5);
const ACTIVE_LABEL_WIDTH = spacing(38);
const TAB_ITEM_GAP = spacing(0);
const ANIMATION_DURATION_MS = 240;
const BAR_WIDTH_ANIMATION_DURATION_MS = 420;
const LABEL_IDLE_TIMEOUT_MS = 15000;

const glassPalette = {
  activeText: "#b9e5ff",
  baseSurface: "rgba(3, 14, 27, 0.38)",
  blueRefraction: "rgba(74, 182, 255, 0.12)",
  inactiveText: "rgba(226, 240, 251, 0.74)",
  innerStroke: "rgba(255, 255, 255, 0.2)",
  nativeTint: "rgba(3, 14, 27, 0.28)",
  rim: "rgba(174, 224, 255, 0.36)",
  shadow: "rgba(0, 11, 24, 0.5)",
};

const iconByRoute: Record<TabRouteName, keyof typeof Feather.glyphMap> = {
  TabHome: "home",
  TabMyDesk: "briefcase",
  TabProfile: "user",
  TabVision: "book-open",
};

const labelByRoute: Record<TabRouteName, string> = {
  TabHome: "Home",
  TabMyDesk: "MyDesk",
  TabProfile: "Profile",
  TabVision: "Vision",
};

const canUseGlassEffect = () => {
  if (Platform.OS !== "ios") {
    return false;
  }

  try {
    return isGlassEffectAPIAvailable();
  } catch {
    return false;
  }
};

interface GlassTabItemProps {
  accessibilityLabel: string;
  focused: boolean;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  labelVisible: boolean;
  onLongPress: () => void;
  onPress: () => void;
  testID?: string;
}

const GlassTabItem = ({
  accessibilityLabel,
  focused,
  icon,
  label,
  labelVisible,
  onLongPress,
  onPress,
  testID,
}: GlassTabItemProps) => {
  const reduceMotionEnabled = useReducedMotionPreference();
  const selectionProgress = useSharedValue(focused ? 1 : 0);
  const labelProgress = useSharedValue(focused && labelVisible ? 1 : 0);

  useEffect(() => {
    selectionProgress.value = withTiming(focused ? 1 : 0, {
      duration: reduceMotionEnabled ? 0 : ANIMATION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
    labelProgress.value = withTiming(focused && labelVisible ? 1 : 0, {
      duration: reduceMotionEnabled ? 0 : ANIMATION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [
    focused,
    labelProgress,
    labelVisible,
    reduceMotionEnabled,
    selectionProgress,
  ]);

  const itemAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 0.78 + selectionProgress.value * 0.22,
    transform: [{ scale: 0.95 + selectionProgress.value * 0.05 }],
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    marginLeft: ACTIVE_LABEL_GAP * labelProgress.value,
    opacity: labelProgress.value,
    width: ACTIVE_LABEL_WIDTH * labelProgress.value,
  }));

  const activeGlowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: selectionProgress.value,
    width:
      ACTIVE_CAPSULE_COLLAPSED_WIDTH +
      (ACTIVE_CAPSULE_WIDTH - ACTIVE_CAPSULE_COLLAPSED_WIDTH) *
        labelProgress.value,
  }));

  const iconColor = focused
    ? glassPalette.activeText
    : glassPalette.inactiveText;
  const labelColor = focused
    ? glassPalette.activeText
    : glassPalette.inactiveText;

  return (
    <View style={styles.tabButtonWrap}>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="tab"
        accessibilityState={focused ? { selected: true } : undefined}
        android_ripple={{
          borderless: false,
          color: "rgba(184, 220, 255, 0.16)",
        }}
        hitSlop={spacing(4)}
        onLongPress={onLongPress}
        onPress={onPress}
        style={({ pressed }) => [
          styles.tabButton,
          pressed ? styles.tabButtonPressed : undefined,
        ]}
        testID={testID}
      >
        <Animated.View style={[styles.tabItem, itemAnimatedStyle]}>
          <Animated.View
            pointerEvents="none"
            style={[styles.activeCapsule, activeGlowAnimatedStyle]}
          >
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.16)", "rgba(255, 255, 255, 0)"]}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <Feather
            color={iconColor}
            name={icon}
            size={spacing(23)}
            style={focused ? styles.activeIcon : styles.inactiveIcon}
          />
          <Animated.View style={[styles.labelClip, labelAnimatedStyle]}>
            <Animated.Text
              maxFontSizeMultiplier={1.2}
              numberOfLines={1}
              style={[styles.tabLabel, { color: labelColor }]}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </View>
  );
};

export const GlassTabBar = ({
  descriptors,
  insets,
  navigation,
  state,
}: BottomTabBarProps) => {
  const safeAreaInsets = useSafeAreaInsets();
  const reduceMotionEnabled = useReducedMotionPreference();
  const { width: windowWidth } = useWindowDimensions();
  const [labelsVisible, setLabelsVisible] = useState(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barWidthProgress = useSharedValue(labelsVisible ? 1 : 0);
  const bottomInset = Math.max(
    insets.bottom,
    safeAreaInsets.bottom,
    spacing(10),
  );
  const glassAvailable = canUseGlassEffect();
  const expandedBarWidth = windowWidth * TAB_BAR_WIDTH_RATIO;
  const collapsedBarWidth = windowWidth * TAB_BAR_COLLAPSED_WIDTH_RATIO;

  useEffect(() => {
    barWidthProgress.value = withTiming(labelsVisible ? 1 : 0, {
      duration: reduceMotionEnabled ? 0 : BAR_WIDTH_ANIMATION_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [barWidthProgress, labelsVisible, reduceMotionEnabled]);

  const barAnimatedStyle = useAnimatedStyle(() => ({
    width:
      collapsedBarWidth +
      (expandedBarWidth - collapsedBarWidth) * barWidthProgress.value,
  }));

  const showLabelsTemporarily = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    setLabelsVisible(true);
    idleTimerRef.current = setTimeout(() => {
      setLabelsVisible(false);
    }, LABEL_IDLE_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    showLabelsTemporarily();

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [showLabelsTemporarily, state.index]);

  const barContent = (
    <View style={styles.tabRow}>
      {state.routes.map((route, index) => {
        const routeName = route.name as TabRouteName;
        const descriptor = descriptors[route.key];
        const options = descriptor.options;
        const focused = state.index === index;
        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : (options.title ?? labelByRoute[routeName] ?? route.name);

        const onPress = () => {
          showLabelsTemporarily();

          const event = navigation.emit({
            canPreventDefault: true,
            target: route.key,
            type: "tabPress",
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            target: route.key,
            type: "tabLongPress",
          });
        };

        return (
          <GlassTabItem
            accessibilityLabel={
              options.tabBarAccessibilityLabel ?? `${label} tab`
            }
            focused={focused}
            icon={iconByRoute[routeName] ?? "circle"}
            key={route.key}
            label={label}
            labelVisible={labelsVisible}
            onLongPress={onLongPress}
            onPress={onPress}
            testID={options.tabBarButtonTestID}
          />
        );
      })}
    </View>
  );

  const materialContent = (
    <>
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0.09)",
          glassPalette.baseSurface,
          glassPalette.blueRefraction,
        ]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0.32)",
          "rgba(174, 224, 255, 0.055)",
          "rgba(255, 255, 255, 0)",
        ]}
        pointerEvents="none"
        style={styles.topGlassHighlight}
      />
      <View pointerEvents="none" style={styles.innerGlassStroke} />
      {barContent}
    </>
  );

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.root,
        barAnimatedStyle,
        {
          paddingBottom: bottomInset,
        },
      ]}
    >
      <View style={styles.glassShadow}>
        <View style={styles.glassFrame}>
          {glassAvailable ? (
            <GlassView
              colorScheme="light"
              glassEffectStyle="regular"
              isInteractive
              style={[StyleSheet.absoluteFill, styles.nativeGlassLayer]}
              tintColor={glassPalette.nativeTint}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.fallbackGlass]} />
          )}
          {materialContent}
        </View>
      </View>
    </Animated.View>
  );
};

export const getGlassTabBarHeight = (bottomInset: number) =>
  TAB_BAR_HEIGHT + Math.max(bottomInset, spacing(10)) + spacing(18);

const styles = StyleSheet.create({
  activeIcon: {
    textShadowColor: "rgba(74, 182, 255, 0.42)",
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: spacing(6),
  },
  activeCapsule: {
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.13)",
    borderColor: "rgba(174, 224, 255, 0.42)",
    borderRadius: PILL_RADIUS,
    borderWidth: 1,
    height: ACTIVE_CAPSULE_HEIGHT,
    overflow: "hidden",
    position: "absolute",
    shadowColor: "rgba(74, 182, 255, 0.26)",
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.24,
    shadowRadius: spacing(16),
    width: ACTIVE_CAPSULE_WIDTH,
  },
  fallbackGlass: {
    backgroundColor: "rgba(3, 14, 27, 0.42)",
  },
  glassFrame: {
    backgroundColor: "rgba(3, 14, 27, 0.18)",
    borderColor: glassPalette.rim,
    borderRadius: PILL_RADIUS,
    borderWidth: 1,
    height: TAB_BAR_HEIGHT,
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: spacing(6),
  },
  glassShadow: {
    borderRadius: PILL_RADIUS,
    shadowColor: glassPalette.shadow,
    shadowOffset: { height: spacing(14), width: 0 },
    shadowOpacity: 0.32,
    shadowRadius: spacing(24),
  },
  nativeGlassLayer: {
    borderRadius: PILL_RADIUS,
    overflow: "hidden",
  },
  inactiveIcon: {
    textShadowColor: "rgba(0, 11, 24, 0.54)",
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: spacing(4),
  },
  innerGlassStroke: {
    ...StyleSheet.absoluteFillObject,
    borderColor: glassPalette.innerStroke,
    borderRadius: PILL_RADIUS,
    borderWidth: 1,
    margin: StyleSheet.hairlineWidth,
  },
  root: {
    alignSelf: "center",
    backgroundColor: "transparent",
    bottom: spacing(4),
    position: "absolute",
  },
  tabButton: {
    alignItems: "center",
    borderRadius: PILL_RADIUS,
    flex: 1,
    justifyContent: "center",
    zIndex: 2,
  },
  tabButtonWrap: {
    borderRadius: PILL_RADIUS,
    flex: 1,
    height: TAB_ITEM_HEIGHT,
    minWidth: spacing(48),
    zIndex: 2,
  },
  tabButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  tabItem: {
    alignItems: "center",
    borderRadius: PILL_RADIUS,
    flexDirection: "row",
    height: TAB_ITEM_HEIGHT,
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: spacing(12),
  },
  labelClip: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tabLabel: {
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    maxWidth: ACTIVE_LABEL_WIDTH,
    textAlign: "center",
    textShadowColor: "rgba(11, 26, 56, 0.34)",
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: spacing(5),
  },
  tabRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: TAB_ITEM_GAP,
    height: "100%",
    zIndex: 2,
  },
  topGlassHighlight: {
    height: spacing(30),
    left: spacing(12),
    position: "absolute",
    right: spacing(12),
    top: spacing(2),
  },
});
