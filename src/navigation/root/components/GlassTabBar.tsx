import { Feather } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppFonts } from "@/assets/fonts";
import { useReducedMotionPreference } from "@/design-system/hooks";
import { reactNativeColorScheme } from "@/design-system/tokens/colors";
import type { AppTabParamList } from "@/navigation/route-types";
import { fontSize, spacing } from "@/utils/scale";

type TabRouteName = keyof AppTabParamList;

const TAB_BAR_HEIGHT = spacing(66);
const TAB_BAR_WIDTH_RATIO = 0.88;
const TAB_BAR_COLLAPSED_WIDTH_RATIO = 0.68;
const TAB_ITEM_HEIGHT = spacing(50);
const ACTIVE_TAB_WIDTH = spacing(112);
const INACTIVE_TAB_WIDTH = spacing(58);
const PILL_RADIUS = 999;
const ACTIVE_LABEL_GAP = spacing(5);
const ACTIVE_LABEL_WIDTH = spacing(58);
const TAB_ITEM_GAP = spacing(0);
const ANIMATION_DURATION_MS = 240;
const BAR_WIDTH_ANIMATION_DURATION_MS = 420;
const LABEL_IDLE_TIMEOUT_MS = 5000;

const glassPalette = {
  activeText: "#f8fbff",
  baseSurface: reactNativeColorScheme.ultiHuman.tabGlassSurface,
  blueRefraction: "rgba(74, 182, 255, 0.12)",
  inactiveText: "rgba(237, 248, 255, 0.78)",
  innerStroke: "rgba(174, 224, 255, 0.2)",
  rim: "rgba(174, 224, 255, 0.34)",
  shadow: "rgba(0, 11, 24, 0.36)",
};

const iconByRoute: Record<TabRouteName, keyof typeof Feather.glyphMap> = {
  TabHome: "home",
  TabMyDesk: "briefcase",
  TabProfile: "user",
  TabWexa: "command",
};

const labelByRoute: Record<TabRouteName, string> = {
  TabHome: "Home",
  TabMyDesk: "MyDesk",
  TabProfile: "Profile",
  TabWexa: "Wexa",
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

  const activeCapsuleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: selectionProgress.value,
    transform: [{ scale: 0.92 + selectionProgress.value * 0.08 }],
  }));

  const tabButtonWrapAnimatedStyle = useAnimatedStyle(() => ({
    width:
      INACTIVE_TAB_WIDTH +
      (ACTIVE_TAB_WIDTH - INACTIVE_TAB_WIDTH) * labelProgress.value,
  }));

  const iconColor = focused
    ? glassPalette.activeText
    : glassPalette.inactiveText;
  const labelColor = focused
    ? glassPalette.activeText
    : glassPalette.inactiveText;

  return (
    <Animated.View style={[styles.tabButtonWrap, tabButtonWrapAnimatedStyle]}>
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
            style={[styles.activeCapsule, activeCapsuleAnimatedStyle]}
          >
            <LinearGradient
              colors={[
                "rgba(74, 182, 255, 0.22)",
                "rgba(174, 224, 255, 0.1)",
                "rgba(2, 9, 20, 0.04)",
              ]}
              end={{ x: 1, y: 1 }}
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
    </Animated.View>
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
          "rgba(255, 255, 255, 0.06)",
          "rgba(74, 182, 255, 0.05)",
          glassPalette.baseSurface,
          "rgba(2, 9, 20, 0.16)",
          glassPalette.blueRefraction,
        ]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0.075)",
          "rgba(174, 224, 255, 0.045)",
          "rgba(2, 9, 20, 0.12)",
        ]}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        style={styles.innerLiquidSurface}
      />
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0.2)",
          "rgba(174, 224, 255, 0.04)",
          "rgba(255, 255, 255, 0)",
        ]}
        pointerEvents="none"
        style={styles.topGlassHighlight}
      />
      <View pointerEvents="none" style={styles.innerGlassStroke} />
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0)",
          "rgba(174, 224, 255, 0.04)",
          "rgba(255, 255, 255, 0.08)",
        ]}
        pointerEvents="none"
        style={styles.bottomGlassHighlight}
      />
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
        <View style={styles.glassFrame}>{materialContent}</View>
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
    // Product wants a visible selected inner capsule; keep this layer.
    borderColor: "rgba(174, 224, 255, 0.3)",
    borderRadius: PILL_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    bottom: spacing(7),
    left: spacing(3),
    overflow: "hidden",
    position: "absolute",
    right: spacing(3),
    shadowColor: "rgba(74, 182, 255, 0.34)",
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: spacing(10),
    top: spacing(7),
  },
  glassFrame: {
    backgroundColor: "transparent",
    borderColor: glassPalette.rim,
    borderRadius: PILL_RADIUS,
    borderWidth: StyleSheet.hairlineWidth,
    height: TAB_BAR_HEIGHT,
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: spacing(6),
  },
  glassShadow: {
    borderRadius: PILL_RADIUS,
    shadowColor: glassPalette.shadow,
    shadowOffset: { height: spacing(18), width: 0 },
    shadowOpacity: 0.26,
    shadowRadius: spacing(32),
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
    borderWidth: StyleSheet.hairlineWidth,
    margin: StyleSheet.hairlineWidth,
  },
  innerLiquidSurface: {
    borderRadius: PILL_RADIUS,
    bottom: spacing(5),
    left: spacing(5),
    position: "absolute",
    right: spacing(5),
    top: spacing(5),
  },
  root: {
    alignSelf: "center",
    backgroundColor: "transparent",
    bottom: spacing(4),
    paddingHorizontal: spacing(2),
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
    height: TAB_ITEM_HEIGHT,
    minWidth: INACTIVE_TAB_WIDTH,
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
  bottomGlassHighlight: {
    bottom: spacing(3),
    height: spacing(20),
    left: spacing(18),
    position: "absolute",
    right: spacing(18),
  },
  tabRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: TAB_ITEM_GAP,
    height: "100%",
    justifyContent: "space-between",
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
