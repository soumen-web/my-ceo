import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { PremiumAnimatedView, PremiumPressable } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { MyOrganizationStackParamList } from '@/navigation/route-types';
import { fontSize, radius, spacing } from '@/utils/scale';

import { MyOrganizationScreenFrame } from '../components';
import {
  type MyOrganizationOverviewItem,
  useMyOrganizationScreenModel,
} from '../hooks/useMyOrganizationScreenModel';

type MyOrganizationScreenProps = NativeStackScreenProps<
  MyOrganizationStackParamList,
  'MyOrganizationOverview'
>;

const iconByRoute: Record<keyof MyOrganizationStackParamList, keyof typeof Feather.glyphMap> = {
  MyOrganizationOverview: 'grid',
  MyOrganizationInfo: 'briefcase',
  MyReportingManager: 'user-check',
  MyTeam: 'users',
  MyWorkLocation: 'map-pin',
  MyWorkMode: 'calendar',
};

const moduleColors = reactNativeColorScheme.ultiHuman.module;

export const MyOrganizationScreen = ({ navigation }: MyOrganizationScreenProps) => {
  const { errorMessage, isRefreshing, overviewItems, refresh, status } =
    useMyOrganizationScreenModel();
  const isInitialLoading = status === 'loading' && !errorMessage;

  const handleItemPress = (item: MyOrganizationOverviewItem) => {
    navigation.navigate(item.route);
  };

  return (
    <MyOrganizationScreenFrame
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      routeLabel="Workspace"
      title="My Organization"
    >
      <LinearGradient
        colors={moduleColors.heroGradient}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.summaryCard}
      >
        <View style={styles.summaryTop}>
          <View style={styles.summaryIcon}>
            <Feather color={moduleColors.icon} name="layers" size={20} />
          </View>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryEyebrow}>Operating profile</Text>
            <Text style={styles.summaryTitle}>Organization command center</Text>
            <Text style={styles.summaryText}>
              Team, manager, location, and work setup distilled for quick mobile decisions.
            </Text>
          </View>
        </View>
        <ScrollView
          horizontal
          bounces
          contentContainerStyle={styles.signalRail}
          showsHorizontalScrollIndicator={false}
        >
          {overviewItems.slice(0, 4).map((item) => (
            <View key={`signal-${item.route}`} style={styles.signalPill}>
              <Text numberOfLines={1} style={styles.signalLabel}>
                {item.eyebrow}
              </Text>
              <Text numberOfLines={1} style={styles.signalValue}>
                {item.value}
              </Text>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>

      {isInitialLoading ? (
        <View style={styles.feedbackCard}>
          <ActivityIndicator color={reactNativeColorScheme.ultiHuman.accent} size="small" />
          <Text style={styles.feedbackText}>Loading organization workspace...</Text>
        </View>
      ) : errorMessage ? (
        <View style={[styles.feedbackCard, styles.errorCard]}>
          <Feather
            color={reactNativeColorScheme.status.danger.foreground}
            name="alert-circle"
            size={18}
          />
          <Text style={[styles.feedbackText, styles.errorText]}>{errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.list}>
        {overviewItems.map((item, index) => (
          <PremiumAnimatedView delay={index * 56} distance={5} key={item.route}>
            <PremiumPressable
              accessibilityLabel={`${item.title}. ${item.value}. Opens details.`}
              accessibilityRole="button"
              android_ripple={{ color: moduleColors.accentWash }}
              onPress={() => handleItemPress(item)}
              style={({ pressed }) => [
                styles.itemCard,
                pressed ? styles.itemCardPressed : undefined,
              ]}
            >
              <View style={styles.itemIcon}>
                <Feather
                  color={moduleColors.icon}
                  name={iconByRoute[item.route]}
                  size={19}
                />
              </View>
              <View style={styles.itemCopy}>
                <Text style={styles.itemEyebrow}>{item.eyebrow}</Text>
                <Text numberOfLines={1} style={styles.itemTitle}>
                  {item.title}
                </Text>
                <Text numberOfLines={1} style={styles.itemValue}>
                  {item.value}
                </Text>
              </View>
              <Feather color={reactNativeColorScheme.text.disabled} name="chevron-right" size={19} />
            </PremiumPressable>
          </PremiumAnimatedView>
        ))}
      </View>
    </MyOrganizationScreenFrame>
  );
};

const styles = StyleSheet.create({
  errorCard: {
    backgroundColor: reactNativeColorScheme.status.danger.background,
    borderColor: reactNativeColorScheme.status.danger.border,
  },
  errorText: {
    color: reactNativeColorScheme.status.danger.foreground,
  },
  feedbackCard: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    minHeight: spacing(58),
    paddingHorizontal: spacing(14),
  },
  feedbackText: {
    color: reactNativeColorScheme.text.secondary,
    flex: 1,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  itemCard: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(14),
    minHeight: spacing(82),
    paddingHorizontal: spacing(14),
    paddingVertical: spacing(12),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: spacing(16),
  },
  itemCardPressed: {
    opacity: 0.82,
  },
  itemCopy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  itemEyebrow: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  itemIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(46),
    justifyContent: 'center',
    width: spacing(46),
  },
  itemTitle: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(22),
  },
  itemValue: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  list: {
    gap: spacing(12),
  },
  signalLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  signalPill: {
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(2),
    minWidth: spacing(126),
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(9),
  },
  signalRail: {
    gap: spacing(8),
    paddingRight: spacing(2),
  },
  signalValue: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  summaryCard: {
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(15),
    overflow: 'hidden',
    padding: spacing(18),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(12), width: 0 },
    shadowOpacity: 0.24,
    shadowRadius: spacing(22),
  },
  summaryCopy: {
    flex: 1,
    gap: spacing(3),
    minWidth: 0,
  },
  summaryEyebrow: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderWidth: 1,
    borderRadius: radius(8),
    height: spacing(48),
    justifyContent: 'center',
    width: spacing(48),
  },
  summaryText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  summaryTitle: {
    color: moduleColors.ink,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(19),
    lineHeight: spacing(25),
  },
  summaryTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing(14),
  },
});
