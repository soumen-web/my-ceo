import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { PremiumAnimatedView } from '@/design-system/components';
import { MobileScreenShell } from '@/design-system/patterns/MobileScreenShell';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { toAuthenticatedUserViewModel, useAuthSession } from '@/modules/auth';
import { DashboardShellHeader } from '@/modules/home/presentation/components/DashboardShellHeader';
import {
  ROUTES,
  type MyDeskStackParamList,
} from '@/navigation/route-types';
import { fontSize, radius, spacing } from '@/utils/scale';

type MyDeskScreenProps = NativeStackScreenProps<MyDeskStackParamList, 'MyDeskHome'>;

type DeskPriority = 'high' | 'medium' | 'normal';
type DeskGroup = 'today' | 'requests' | 'people';

interface DeskItem {
  description: string;
  group: DeskGroup;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  meta: string;
  priority: DeskPriority;
  route: keyof MyDeskStackParamList;
}

const deskItems: DeskItem[] = [
  {
    description: 'Daily readiness, history, and attendance activity.',
    group: 'today',
    icon: 'clock',
    label: 'Attendance',
    meta: 'Daily action',
    priority: 'high',
    route: ROUTES.attendance,
  },
  {
    description: 'Apply, track, and review leave requests.',
    group: 'requests',
    icon: 'edit-3',
    label: 'Leave',
    meta: 'Request flow',
    priority: 'high',
    route: ROUTES.leave,
  },
  {
    description: 'Payslips, salary cycles, and payroll details.',
    group: 'today',
    icon: 'credit-card',
    label: 'Payroll',
    meta: 'Compensation',
    priority: 'medium',
    route: ROUTES.payroll,
  },
  {
    description: 'Ask HR questions and follow response status.',
    group: 'requests',
    icon: 'message-square',
    label: 'HR Query',
    meta: 'Support',
    priority: 'medium',
    route: ROUTES.hrQuery,
  },
  {
    description: 'Company notices and workforce updates.',
    group: 'today',
    icon: 'bell',
    label: 'Notifications',
    meta: 'Updates',
    priority: 'normal',
    route: ROUTES.notifications,
  },
  {
    description: 'Team, reporting manager, location, and work mode.',
    group: 'people',
    icon: 'users',
    label: 'My Organization',
    meta: 'Directory',
    priority: 'normal',
    route: ROUTES.myOrganization,
  },
  {
    description: 'Employee services and workforce hub workflows.',
    group: 'people',
    icon: 'briefcase',
    label: 'Workforce Hub',
    meta: 'Services',
    priority: 'medium',
    route: ROUTES.workforceHub,
  },
];

const sectionConfig: Record<
  DeskGroup,
  {
    eyebrow: string;
    icon: keyof typeof Feather.glyphMap;
    title: string;
  }
> = {
  people: {
    eyebrow: 'Workspace',
    icon: 'grid',
    title: 'People & services',
  },
  requests: {
    eyebrow: 'Pending work',
    icon: 'inbox',
    title: 'Requests & support',
  },
  today: {
    eyebrow: 'Now',
    icon: 'zap',
    title: 'Today at work',
  },
};

const priorityCopy: Record<DeskPriority, string> = {
  high: 'Priority',
  medium: 'Ready',
  normal: 'Open',
};

const initialsFrom = (value: string | undefined): string => {
  const parts = value?.trim().split(/\s+/).filter(Boolean) ?? [];

  return parts.length
    ? parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : 'U';
};

export const MyDeskScreen = ({ navigation }: MyDeskScreenProps) => {
  const { user } = useAuthSession();
  const userViewModel = toAuthenticatedUserViewModel(user);
  const displayName = userViewModel?.displayName ?? 'Employee';
  const [refreshing, setRefreshing] = useState(false);

  const groupedDeskItems = useMemo(
    () =>
      (Object.keys(sectionConfig) as DeskGroup[]).map((group) => ({
        ...sectionConfig[group],
        data: deskItems.filter((item) => item.group === group),
        group,
      })),
    [],
  );

  const primaryActions = deskItems.filter((item) => item.priority === 'high');
  const latestActivities = deskItems.slice(0, 3);

  const navigateTo = useCallback(
    (route: keyof MyDeskStackParamList) => {
      navigation.navigate(route);
    },
    [navigation],
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 650);
  }, []);

  return (
    <MobileScreenShell
      header={
        <DashboardShellHeader
          initials={initialsFrom(displayName)}
          onNotificationPress={() => navigation.navigate(ROUTES.notifications)}
          subtitle=""
          title={`Hello ${displayName}`}
        />
      }
      onRefresh={handleRefresh}
      refreshing={refreshing}
    >
      <PremiumAnimatedView distance={6} style={styles.hero}>
        <LinearGradient
          colors={reactNativeColorScheme.ultiHuman.module.heroGradient}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroGlow} />
        <View style={styles.heroTopRow}>
          <View style={styles.heroCopy}>
            <Text style={styles.routeLabel}>MyDesk</Text>
            <Text style={styles.pageTitle}>Workspace command center</Text>
          </View>
          <View style={styles.heroIconFrame}>
            <Feather
              color={reactNativeColorScheme.ultiHuman.accent}
              name="layers"
              size={22}
            />
          </View>
        </View>
        <View style={styles.summaryGrid}>
          <SummaryMetric label="Tools" value={String(deskItems.length)} />
          <SummaryMetric label="Priority" value={String(primaryActions.length)} />
          <SummaryMetric label="Groups" value={String(groupedDeskItems.length)} />
        </View>
      </PremiumAnimatedView>

      <View style={styles.sectionBlock}>
        <SectionHeading
          action="High impact"
          icon="target"
          title="Start here"
        />
        <View style={styles.primaryGrid}>
          {primaryActions.map((item, index) => (
            <PrimaryActionCard
              item={item}
              key={item.route}
              onPress={() => navigateTo(item.route)}
              rank={index + 1}
            />
          ))}
        </View>
      </View>

      {groupedDeskItems.map((section) => (
        <View key={section.group} style={styles.sectionBlock}>
          <SectionHeading
            action={section.eyebrow}
            icon={section.icon}
            title={section.title}
          />
          <View style={styles.groupGrid}>
            {section.data.map((item) => (
              <WorkspaceCard
                item={item}
                key={item.route}
                onPress={() => navigateTo(item.route)}
              />
            ))}
          </View>
        </View>
      ))}

      <View style={styles.sectionBlock}>
        <SectionHeading action="Live" icon="activity" title="Recent activity" />
        <View style={styles.activityPanel}>
          <LinearGradient
            colors={[
              'rgba(123, 204, 255, 0.08)',
              reactNativeColorScheme.ultiHuman.glassSurface,
              'rgba(4, 18, 34, 0.42)',
            ]}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          {latestActivities.map((item) => (
            <Pressable
              accessibilityLabel={`Open ${item.label}`}
              accessibilityRole="button"
              key={item.route}
              onPress={() => navigateTo(item.route)}
              style={({ pressed }) => [
                styles.activityRow,
                pressed ? styles.pressed : undefined,
              ]}
            >
              <View style={styles.activityDot} />
              <View style={styles.activityCopy}>
                <Text numberOfLines={1} style={styles.activityTitle}>
                  {item.label}
                </Text>
                <Text numberOfLines={1} style={styles.activityDescription}>
                  {item.meta}
                </Text>
              </View>
              <Feather
                color={reactNativeColorScheme.ultiHuman.muted}
                name="arrow-up-right"
                size={16}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </MobileScreenShell>
  );
};

const SummaryMetric = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.summaryMetric}>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

const SectionHeading = ({
  action,
  icon,
  title,
}: {
  action: string;
  icon: keyof typeof Feather.glyphMap;
  title: string;
}) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionIcon}>
        <Feather
          color={reactNativeColorScheme.ultiHuman.accent}
          name={icon}
          size={15}
        />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <Text style={styles.sectionAction}>{action}</Text>
  </View>
);

const PrimaryActionCard = ({
  item,
  onPress,
  rank,
}: {
  item: DeskItem;
  onPress: () => void;
  rank: number;
}) => (
  <Pressable
    accessibilityLabel={`Open ${item.label}`}
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [
      styles.primaryCard,
      pressed ? styles.pressed : undefined,
    ]}
  >
    <LinearGradient
      colors={[
        'rgba(123, 204, 255, 0.08)',
        reactNativeColorScheme.ultiHuman.surface.glassAction,
        'rgba(4, 18, 34, 0.44)',
      ]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
    <View pointerEvents="none" style={styles.cardLiquidHighlight} />
    <View style={styles.primaryCardTop}>
      <View style={styles.primaryIcon}>
        <Feather
          color={reactNativeColorScheme.ultiHuman.text}
          name={item.icon}
          size={20}
        />
      </View>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
    </View>
    <View style={styles.primaryCopy}>
      <Text numberOfLines={1} style={styles.primaryTitle}>
        {item.label}
      </Text>
      <Text numberOfLines={1} style={styles.primaryDescription}>
        {item.meta}
      </Text>
    </View>
    <View style={styles.cardFooter}>
      <StatusChip priority={item.priority} />
      <Feather
        color={reactNativeColorScheme.ultiHuman.accent}
        name="arrow-right"
        size={16}
      />
    </View>
  </Pressable>
);

const WorkspaceCard = ({
  item,
  onPress,
}: {
  item: DeskItem;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityLabel={`Open ${item.label}`}
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [
      styles.workspaceCard,
      pressed ? styles.pressed : undefined,
    ]}
  >
    <LinearGradient
      colors={[
        'rgba(123, 204, 255, 0.08)',
        reactNativeColorScheme.ultiHuman.glassSurface,
        'rgba(4, 18, 34, 0.42)',
      ]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
    <View pointerEvents="none" style={styles.cardLiquidHighlight} />
    <View style={styles.workspaceTopRow}>
      <View style={styles.iconFrame}>
        <Feather
          color={reactNativeColorScheme.ultiHuman.accentPressed}
          name={item.icon}
          size={19}
        />
      </View>
      <StatusChip priority={item.priority} />
    </View>
    <View style={styles.cardCopy}>
      <Text numberOfLines={1} style={styles.cardTitle}>
        {item.label}
      </Text>
    </View>
    <View style={styles.cardFooter}>
      <Text numberOfLines={1} style={styles.cardMeta}>
        {item.meta}
      </Text>
      <Feather
        color={reactNativeColorScheme.ultiHuman.muted}
        name="chevron-right"
        size={18}
      />
    </View>
  </Pressable>
);

const StatusChip = ({ priority }: { priority: DeskPriority }) => {
  const isPriority = priority === 'high';

  return (
    <View style={[styles.statusChip, isPriority ? styles.priorityChip : null]}>
      <Text style={[styles.statusText, isPriority ? styles.priorityText : null]}>
        {priorityCopy[priority]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  activityCopy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  activityDescription: {
    color: reactNativeColorScheme.ultiHuman.muted,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  activityDot: {
    backgroundColor: reactNativeColorScheme.ultiHuman.accent,
    borderRadius: radius(8),
    height: spacing(8),
    shadowColor: reactNativeColorScheme.ultiHuman.accent,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: spacing(8),
    width: spacing(8),
  },
  activityPanel: {
    backgroundColor: 'rgba(4, 18, 34, 0.18)',
    borderColor: reactNativeColorScheme.ultiHuman.glassBorder,
    borderRadius: radius(20),
    borderWidth: 1,
    overflow: 'hidden',
  },
  activityRow: {
    alignItems: 'center',
    borderBottomColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderSoft,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing(12),
    minHeight: spacing(58),
    paddingHorizontal: spacing(14),
    paddingVertical: spacing(10),
  },
  activityTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(17),
  },
  cardCopy: {
    gap: spacing(3),
    minHeight: spacing(24),
  },
  cardFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardMeta: {
    color: reactNativeColorScheme.ultiHuman.muted,
    flex: 1,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  cardTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(15),
    lineHeight: spacing(20),
  },
  cardLiquidHighlight: {
    backgroundColor: 'rgba(174, 224, 255, 0.1)',
    borderRadius: radius(18),
    height: spacing(18),
    left: spacing(14),
    opacity: 0.34,
    position: 'absolute',
    right: spacing(14),
    top: spacing(8),
  },
  groupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(12),
  },
  hero: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(22),
    borderWidth: 1,
    gap: spacing(16),
    overflow: 'hidden',
    padding: spacing(18),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(12), width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: spacing(22),
  },
  heroCopy: {
    flex: 1,
    gap: spacing(5),
    minWidth: 0,
  },
  heroGlow: {
    backgroundColor: 'rgba(74, 182, 255, 0.14)',
    borderRadius: radius(48),
    height: spacing(110),
    position: 'absolute',
    right: -spacing(38),
    top: -spacing(42),
    width: spacing(110),
  },
  heroIconFrame: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassSoft,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(18),
    borderWidth: 1,
    height: spacing(48),
    justifyContent: 'center',
    width: spacing(48),
  },
  heroTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing(14),
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: 'rgba(4, 18, 34, 0.2)',
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(16),
    borderWidth: 1,
    height: spacing(40),
    justifyContent: 'center',
    width: spacing(40),
  },
  pageTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(25),
    lineHeight: spacing(31),
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.985 }],
  },
  primaryCard: {
    backgroundColor: 'rgba(4, 18, 34, 0.18)',
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(20),
    borderWidth: 1,
    flex: 1,
    gap: spacing(12),
    minHeight: spacing(148),
    minWidth: spacing(150),
    overflow: 'hidden',
    padding: spacing(14),
  },
  primaryCardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryCopy: {
    flex: 1,
    gap: spacing(4),
  },
  primaryDescription: {
    color: reactNativeColorScheme.ultiHuman.muted,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  primaryGrid: {
    flexDirection: 'row',
    gap: spacing(12),
  },
  primaryIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(4, 18, 34, 0.2)',
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(16),
    borderWidth: 1,
    height: spacing(44),
    justifyContent: 'center',
    width: spacing(44),
  },
  primaryTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(17),
    lineHeight: spacing(22),
  },
  priorityChip: {
    backgroundColor: reactNativeColorScheme.ultiHuman.module.accentSoft,
    borderColor: reactNativeColorScheme.ultiHuman.module.borderStrong,
  },
  priorityText: {
    color: reactNativeColorScheme.ultiHuman.text,
  },
  rankBadge: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassFaint,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderSoft,
    borderRadius: radius(15),
    borderWidth: 1,
    height: spacing(30),
    justifyContent: 'center',
    width: spacing(30),
  },
  rankText: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(15),
  },
  routeLabel: {
    color: reactNativeColorScheme.ultiHuman.module.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    textTransform: 'uppercase',
  },
  sectionAction: {
    color: reactNativeColorScheme.ultiHuman.muted,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textTransform: 'uppercase',
  },
  sectionBlock: {
    gap: spacing(12),
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(12),
    justifyContent: 'space-between',
  },
  sectionIcon: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassFaint,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderSoft,
    borderRadius: radius(14),
    borderWidth: 1,
    height: spacing(28),
    justifyContent: 'center',
    width: spacing(28),
  },
  sectionTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(17),
    lineHeight: spacing(22),
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(9),
    minWidth: 0,
  },
  statusChip: {
    backgroundColor: 'rgba(4, 18, 34, 0.2)',
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderSoft,
    borderRadius: radius(14),
    borderWidth: 1,
    paddingHorizontal: spacing(8),
    paddingVertical: spacing(4),
  },
  statusText: {
    color: reactNativeColorScheme.ultiHuman.muted,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
    textTransform: 'uppercase',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing(10),
  },
  summaryLabel: {
    color: reactNativeColorScheme.ultiHuman.muted,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(14),
  },
  summaryMetric: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassFaint,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderSoft,
    borderRadius: radius(18),
    borderWidth: 1,
    flex: 1,
    gap: spacing(2),
    minHeight: spacing(58),
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(9),
  },
  summaryValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(20),
    lineHeight: spacing(24),
  },
  workspaceCard: {
    backgroundColor: 'rgba(4, 18, 34, 0.18)',
    borderColor: reactNativeColorScheme.ultiHuman.glassBorder,
    borderRadius: radius(20),
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    gap: spacing(12),
    minHeight: spacing(132),
    minWidth: spacing(148),
    overflow: 'hidden',
    padding: spacing(14),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(8), width: 0 },
    shadowOpacity: 0.14,
    shadowRadius: spacing(16),
  },
  workspaceTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
