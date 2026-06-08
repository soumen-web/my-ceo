import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { EnterpriseFeedbackBanner } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type { AttendanceStackParamList } from '@/navigation/route-types';
import { ROUTES } from '@/navigation/route-types';
import { fontSize, radius, spacing } from '@/utils/scale';

import {
  AttendanceHeroCard,
  AttendanceCalendar,
  AttendanceMetricStrip,
  AttendanceScreenFrame,
  AttendanceSkeleton,
  DateNavigationBar,
  InsightList,
  MonthlyInsightStrip,
  PunchTimelinePreview,
  SelectedDayDetailCard,
  WeeklyTrendPreview,
  WorkModeInsights,
} from '../components';
import { useAttendanceScreenModel } from '../hooks/useAttendanceScreenModel';

const moduleColors = reactNativeColorScheme.ultiHuman.module;

type AttendanceHomeScreenProps = NativeStackScreenProps<
  AttendanceStackParamList,
  'AttendanceHome'
>;

export const AttendanceHomeScreen = ({ navigation }: AttendanceHomeScreenProps) => {
  const {
    attendanceRateLabel,
    dayDetail,
    dayStatus,
    errorMessage,
    isInitialLoading,
    isSelectedToday,
    isRefreshing,
    jumpToToday,
    punchActionLabel,
    punchActionType,
    punchErrorMessage,
    punchStatus,
    readinessLabel,
    recordPunch,
    refresh,
    selectDate,
    selectedDate,
    selectedDateLabel,
    selectNextDay,
    selectPreviousDay,
    snapshot,
    sync,
    varianceLabel,
    workDurationLabel,
  } = useAttendanceScreenModel();

  return (
    <AttendanceScreenFrame
      navigation={navigation}
      onRefresh={refresh}
      refreshing={isRefreshing}
      title="Attendance"
    >
      {isInitialLoading ? (
        <AttendanceSkeleton />
      ) : (
        <>
          {errorMessage ? <EnterpriseFeedbackBanner message={errorMessage} tone="error" /> : null}
          {punchErrorMessage ? (
            <EnterpriseFeedbackBanner message={punchErrorMessage} tone="error" />
          ) : null}

          <AttendanceHeroCard
            attendanceRateLabel={attendanceRateLabel}
            isPunching={punchStatus === 'loading'}
            onPunchPress={() => recordPunch({ type: punchActionType })}
            punchActionLabel={punchActionLabel}
            readinessLabel={readinessLabel}
            today={snapshot.today}
            varianceLabel={varianceLabel}
            workDurationLabel={workDurationLabel}
          />

          <DateNavigationBar
            dateLabel={selectedDateLabel}
            isToday={isSelectedToday}
            onNext={selectNextDay}
            onPrevious={selectPreviousDay}
            onToday={jumpToToday}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionDock}
          >
            <QuickNav
              icon="sunrise"
              label="Daily"
              onPress={() => navigation.navigate(ROUTES.attendanceDetail)}
            />
            <QuickNav
              icon="bar-chart-2"
              label="Analytics"
              onPress={() => navigation.navigate(ROUTES.attendanceAnalytics)}
            />
            <QuickNav
              icon="list"
              label="History"
              onPress={() => navigation.navigate(ROUTES.attendanceHistory)}
            />
            <QuickNav
              icon="clock"
              label="Timeline"
              onPress={() => navigation.navigate(ROUTES.attendanceDailyTimeline, {})}
            />
            <QuickNav icon="refresh-cw" label="Sync" onPress={sync} />
          </ScrollView>

          <AttendanceCalendar
            history={snapshot.history}
            onSelectDate={selectDate}
            selectedDate={selectedDate}
          />
          <SelectedDayDetailCard
            day={dayDetail}
            isLoading={dayStatus === 'loading'}
          />
          <MonthlyInsightStrip
            history={snapshot.history}
            monthLabel={snapshot.month.monthLabel}
            rate={snapshot.month.attendanceRate}
          />
          <AttendanceMetricStrip metrics={snapshot.metrics} />
          <PunchTimelinePreview punches={snapshot.recentPunches} />
          <WeeklyTrendPreview data={snapshot.trends} />
          <WorkModeInsights data={snapshot.workModes} />
          <InsightList insights={snapshot.insights} />
        </>
      )}
    </AttendanceScreenFrame>
  );
};

const QuickNav = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [styles.quickNav, pressed && styles.pressed]}
  >
    <View style={styles.quickIcon}>
      <Feather color={moduleColors.icon} name={icon} size={spacing(17)} />
    </View>
    <Text numberOfLines={1} style={styles.quickLabel}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  actionDock: {
    flexDirection: 'row',
    gap: spacing(9),
    paddingRight: spacing(8),
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  quickIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(30),
    justifyContent: 'center',
    width: spacing(30),
  },
  quickLabel: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  quickNav: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(8),
    minHeight: spacing(52),
    minWidth: spacing(124),
    paddingHorizontal: spacing(12),
  },
});
