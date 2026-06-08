import { Feather } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppFonts } from '@/assets/fonts';
import { useReducedMotionPreference } from '@/design-system/hooks';
import { semanticColorTokens } from '@/design-system/tokens/colors';
import type { AppTabParamList } from '@/navigation/route-types';
import { fontSize, spacing } from '@/utils/scale';

type TabRouteName = keyof AppTabParamList;

const TAB_BAR_HEIGHT = spacing(66);
const TAB_HORIZONTAL_MARGIN = spacing(26);
const PILL_RADIUS = 999;
const ACTIVE_LIFT = spacing(1);
const TAB_ITEM_GAP = spacing(2);
const ANIMATION_DURATION_MS = 240;

const glassPalette = {
  baseSurface: 'rgba(255, 255, 255, 0.14)',
  blueRefraction: 'rgba(74, 182, 255, 0.08)',
  inactiveText: 'rgba(200, 215, 230, 0.62)',
  innerStroke: 'rgba(255, 255, 255, 0.46)',
  shadow: 'rgba(0, 11, 24, 0.42)',
};

const iconByRoute: Record<TabRouteName, keyof typeof Feather.glyphMap> = {
  TabHome: 'home',
  TabMyDesk: 'briefcase',
  TabProfile: 'user',
  TabVision: 'book-open',
};

const labelByRoute: Record<TabRouteName, string> = {
  TabHome: 'Home',
  TabMyDesk: 'MyDesk',
  TabProfile: 'Profile',
  TabVision: 'Vision',
};

const canUseGlassEffect = () => {
  if (Platform.OS !== 'ios') {
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
  onLongPress: () => void;
  onPress: () => void;
  testID?: string;
}

const GlassTabItem = ({
  accessibilityLabel,
  focused,
  icon,
  label,
  onLongPress,
  onPress,
  testID,
}: GlassTabItemProps) => {
  const reduceMotionEnabled = useReducedMotionPreference();
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: reduceMotionEnabled ? 0 : ANIMATION_DURATION_MS,
    });
  }, [focused, progress, reduceMotionEnabled]);

  const itemAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 0.78 + progress.value * 0.22,
    transform: [
      { translateY: -ACTIVE_LIFT * progress.value },
      { scale: 0.95 + progress.value * 0.05 },
    ],
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 0.58 + progress.value * 0.42,
  }));

  const activeGlowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const iconColor = focused
    ? semanticColorTokens.light.primaryPressed
    : glassPalette.inactiveText;
  const labelColor = focused
    ? semanticColorTokens.light.primaryPressed
    : glassPalette.inactiveText;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tab"
      accessibilityState={focused ? { selected: true } : undefined}
      android_ripple={{ borderless: false, color: 'rgba(184, 220, 255, 0.16)' }}
      hitSlop={spacing(4)}
      onLongPress={onLongPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabButton,
        pressed ? styles.tabButtonPressed : undefined,
      ]}
      testID={testID}
    >
      <Animated.View
        style={[
          styles.tabItem,
          itemAnimatedStyle,
        ]}
      >
        {focused ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.activeSoftSheen, activeGlowAnimatedStyle]}
          >
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.28)',
                'rgba(255, 255, 255, 0)',
              ]}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        ) : null}
        <Feather
          color={iconColor}
          name={icon}
          size={spacing(23)}
          style={focused ? styles.activeIcon : styles.inactiveIcon}
        />
        <Animated.Text
          maxFontSizeMultiplier={1.2}
          numberOfLines={1}
          style={[styles.tabLabel, { color: labelColor }, labelAnimatedStyle]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

export const GlassTabBar = ({ descriptors, insets, navigation, state }: BottomTabBarProps) => {
  const safeAreaInsets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, safeAreaInsets.bottom, spacing(10));
  const glassAvailable = canUseGlassEffect();
  const reduceMotionEnabled = useReducedMotionPreference();
  const [rowWidth, setRowWidth] = useState(0);
  const activeIndex = useSharedValue(state.index);
  const routeCount = state.routes.length;

  useEffect(() => {
    activeIndex.value = withTiming(state.index, {
      duration: reduceMotionEnabled ? 0 : ANIMATION_DURATION_MS,
    });
  }, [activeIndex, reduceMotionEnabled, state.index]);

  const movingCapsuleStyle = useAnimatedStyle(() => {
    const tabWidth =
      rowWidth > 0 ? (rowWidth - TAB_ITEM_GAP * Math.max(routeCount - 1, 0)) / routeCount : 0;

    return {
      opacity: rowWidth > 0 ? 1 : 0,
      transform: [{ translateX: activeIndex.value * (tabWidth + TAB_ITEM_GAP) }],
      width: tabWidth,
    };
  });

  const barContent = (
    <View
      onLayout={({ nativeEvent }) => {
        const nextWidth = nativeEvent.layout.width;

        setRowWidth((previousWidth) =>
          Math.abs(previousWidth - nextWidth) > 1 ? nextWidth : previousWidth
        );
      }}
      style={styles.tabRow}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.movingActiveCapsule, movingCapsuleStyle]}
      />
      {state.routes.map((route, index) => {
        const routeName = route.name as TabRouteName;
        const descriptor = descriptors[route.key];
        const options = descriptor.options;
        const focused = state.index === index;
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title ?? labelByRoute[routeName] ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            canPreventDefault: true,
            target: route.key,
            type: 'tabPress',
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            target: route.key,
            type: 'tabLongPress',
          });
        };

        return (
          <GlassTabItem
            accessibilityLabel={options.tabBarAccessibilityLabel ?? `${label} tab`}
            focused={focused}
            icon={iconByRoute[routeName] ?? 'circle'}
            key={route.key}
            label={label}
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
          'rgba(255, 255, 255, 0.24)',
          glassPalette.baseSurface,
          glassPalette.blueRefraction,
        ]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.5)',
          'rgba(255, 255, 255, 0.08)',
          'rgba(255, 255, 255, 0)',
        ]}
        pointerEvents="none"
        style={styles.topGlassHighlight}
      />
      <View pointerEvents="none" style={styles.innerGlassStroke} />
      {barContent}
    </>
  );

  return (
    <View
      pointerEvents="box-none"
      style={[styles.root, { paddingBottom: bottomInset }]}
    >
      <View style={styles.glassShadow}>
        <View style={styles.glassFrame}>
          {glassAvailable ? (
            <GlassView
              colorScheme="light"
              glassEffectStyle="regular"
              isInteractive
              style={[StyleSheet.absoluteFill, styles.nativeGlassLayer]}
              tintColor={semanticColorTokens.light.glassTint}
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.fallbackGlass]} />
          )}
          {materialContent}
        </View>
      </View>
    </View>
  );
};

export const getGlassTabBarHeight = (bottomInset: number) =>
  TAB_BAR_HEIGHT + Math.max(bottomInset, spacing(10)) + spacing(18);

const styles = StyleSheet.create({
  activeIcon: {
    textShadowColor: 'rgba(18, 46, 70, 0.28)',
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: spacing(6),
  },
  activeSoftSheen: {
    borderRadius: PILL_RADIUS,
    bottom: spacing(5),
    left: spacing(7),
    position: 'absolute',
    right: spacing(7),
    top: spacing(5),
  },
  fallbackGlass: {
    backgroundColor: semanticColorTokens.light.glassTint,
  },
  glassFrame: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: semanticColorTokens.light.glassBorder,
    borderRadius: PILL_RADIUS,
    borderWidth: 1,
    height: TAB_BAR_HEIGHT,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: spacing(6),
  },
  glassShadow: {
    borderRadius: PILL_RADIUS,
    shadowColor: glassPalette.shadow,
    shadowOffset: { height: spacing(10), width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: spacing(18),
  },
  nativeGlassLayer: {
    borderRadius: PILL_RADIUS,
    overflow: 'hidden',
  },
  inactiveIcon: {
    textShadowColor: 'rgba(255, 255, 255, 0.32)',
    textShadowOffset: { height: 0, width: 0 },
    textShadowRadius: spacing(4),
  },
  innerGlassStroke: {
    ...StyleSheet.absoluteFillObject,
    borderColor: glassPalette.innerStroke,
    borderRadius: PILL_RADIUS,
    borderWidth: 1,
    margin: 1,
  },
  movingActiveCapsule: {
    backgroundColor: 'rgba(255, 255, 255, 0.26)',
    borderColor: 'rgba(255, 255, 255, 0.56)',
    borderRadius: PILL_RADIUS,
    borderWidth: 1,
    bottom: spacing(5),
    left: 0,
    position: 'absolute',
    shadowColor: 'rgba(36, 111, 196, 0.16)',
    shadowOffset: { height: spacing(7), width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: spacing(14),
    top: spacing(5),
    zIndex: 1,
  },
  root: {
    backgroundColor: 'transparent',
    bottom: spacing(4),
    left: 0,
    paddingHorizontal: TAB_HORIZONTAL_MARGIN,
    position: 'absolute',
    right: 0,
  },
  tabButton: {
    borderRadius: PILL_RADIUS,
    flex: 1,
    zIndex: 2,
  },
  tabButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  tabItem: {
    alignItems: 'center',
    borderRadius: PILL_RADIUS,
    gap: spacing(1),
    height: spacing(54),
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tabLabel: {
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(14),
    textAlign: 'center',
    textShadowColor: 'rgba(11, 26, 56, 0.34)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: spacing(5),
  },
  tabRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: TAB_ITEM_GAP,
    zIndex: 2,
  },
  topGlassHighlight: {
    height: spacing(30),
    left: spacing(12),
    position: 'absolute',
    right: spacing(12),
    top: spacing(2),
  },
});
