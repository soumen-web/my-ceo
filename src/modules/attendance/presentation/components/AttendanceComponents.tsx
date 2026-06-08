import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppFonts } from '@/assets/fonts';
import {
  createPremiumCalendarDays,
  dateKeyFromParts,
  daysInMonth,
  getCalendarMonthMeta,
  PremiumSkeleton,
  PremiumMonthCalendar,
} from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type {
  AttendanceDayStatus,
  AttendanceHistoryDay,
  AttendanceInsight,
  AttendanceMetric,
  AttendancePunch,
  AttendanceDayDetail,
  AttendanceToday,
  AttendanceTrendPoint,
  AttendanceWorkMode,
  AttendanceWorkModeInsight,
} from '@/modules/attendance/domain/entities/Attendance';
import { fontSize, radius, spacing } from '@/utils/scale';

import { minutesToDuration } from '../hooks/useAttendanceScreenModel';

const moduleColors = reactNativeColorScheme.ultiHuman.module;
const deepGreen = moduleColors.ink;
const pine = moduleColors.accentPressed;
const mint = moduleColors.accent;
const gold = '#f8bf46';
const coral = '#f47b63';
const sky = '#5f8ef7';

const statusColor: Record<AttendanceDayStatus, string> = {
  absent: coral,
  early: gold,
  holiday: '#2a99d5',
  late: '#f59f45',
  leave: sky,
  present: mint,
  weekend: '#9aa8a3',
};

const modeLabel: Record<AttendanceWorkMode, string> = {
  office: 'Office',
  remote: 'Remote',
  wfh: 'WFH',
};

const modeIcon: Record<AttendanceWorkMode, keyof typeof Feather.glyphMap> = {
  office: 'briefcase',
  remote: 'navigation',
  wfh: 'home',
};

interface AttendanceHeroCardProps {
  attendanceRateLabel: string;
  isPunching: boolean;
  onPunchPress: () => void;
  punchActionLabel: string;
  readinessLabel: string;
  today: AttendanceToday;
  varianceLabel: string;
  workDurationLabel: string;
}

export const AttendanceHeroCard = ({
  attendanceRateLabel,
  isPunching,
  onPunchPress,
  punchActionLabel,
  readinessLabel,
  today,
  varianceLabel,
  workDurationLabel,
}: AttendanceHeroCardProps) => (
  <LinearGradient
    colors={moduleColors.heroGradient}
    end={{ x: 1, y: 1 }}
    start={{ x: 0, y: 0 }}
    style={styles.hero}
  >
    <View style={styles.heroTop}>
      <View style={styles.heroCopy}>
        <Text style={styles.heroKicker}>{today.dateLabel}</Text>
        <Text style={styles.heroTitle}>{workDurationLabel}</Text>
        <Text style={styles.heroSubtitle}>
          {today.statusLabel} - {today.shiftLabel}
        </Text>
      </View>
      <View style={styles.statusOrb}>
        <Text style={styles.statusOrbValue}>{readinessLabel}</Text>
        <Text style={styles.statusOrbLabel}>Ready</Text>
      </View>
    </View>

    <View style={styles.heroStats}>
      <HeroStat label="Clock in" value={today.firstInTime} />
      <HeroStat label="Clock out" value={today.lastOutTime} />
      <HeroStat label="Timing" value={varianceLabel} />
    </View>

    <View style={styles.punchRow}>
      <View style={styles.heroContext}>
        <View style={styles.modeChip}>
          <Feather color={pine} name={modeIcon[today.workMode]} size={spacing(15)} />
          <Text style={styles.modeChipText}>{modeLabel[today.workMode]}</Text>
        </View>
        <View style={styles.modeChip}>
          <Feather color={pine} name="activity" size={spacing(15)} />
          <Text style={styles.modeChipText}>{attendanceRateLabel}</Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        disabled={isPunching}
        onPress={onPunchPress}
        style={({ pressed }) => [
          styles.punchButton,
          pressed && styles.pressed,
          isPunching && styles.disabled,
        ]}
      >
        <Feather color={deepGreen} name="clock" size={spacing(17)} />
        <Text style={styles.punchButtonText}>
          {isPunching ? 'Saving...' : punchActionLabel}
        </Text>
      </Pressable>
    </View>
  </LinearGradient>
);

const HeroStat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.heroStat}>
    <Text numberOfLines={1} style={styles.heroStatValue}>{value}</Text>
    <Text numberOfLines={1} style={styles.heroStatLabel}>{label}</Text>
  </View>
);

export const WorkModeSelector = ({
  onChange,
  value,
}: {
  onChange: (mode: AttendanceWorkMode) => void;
  value: AttendanceWorkMode;
}) => (
  <View style={styles.segmentWrap}>
    {(['office', 'wfh', 'remote'] as const).map((mode) => {
      const isSelected = mode === value;

      return (
        <Pressable
          accessibilityRole="button"
          key={mode}
          onPress={() => onChange(mode)}
          style={({ pressed }) => [
            styles.segmentButton,
            isSelected && styles.segmentButtonSelected,
            pressed && styles.pressed,
          ]}
        >
          <Feather
            color={isSelected ? deepGreen : reactNativeColorScheme.text.secondary}
            name={modeIcon[mode]}
            size={spacing(15)}
          />
          <Text
            style={[
              styles.segmentText,
              isSelected && styles.segmentTextSelected,
            ]}
          >
            {modeLabel[mode]}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

export const AttendanceMetricStrip = ({ metrics }: { metrics: AttendanceMetric[] }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricStrip}>
    {metrics.map((metric) => (
      <View key={metric.label} style={styles.metricCard}>
        <View style={styles.metricIcon}>
          <Feather
            color={metric.trend === 'down' ? coral : pine}
            name={metric.trend === 'down' ? 'trending-down' : metric.trend === 'up' ? 'trending-up' : 'minus'}
            size={spacing(16)}
          />
        </View>
        <Text style={styles.metricValue}>{metric.value}</Text>
        <Text numberOfLines={1} style={styles.metricLabel}>{metric.label}</Text>
      </View>
    ))}
  </ScrollView>
);

export const WeeklyTrendPreview = ({ data }: { data: AttendanceTrendPoint[] }) => {
  const maxValue = Math.max(1, ...data.map((item) => Math.max(item.present, item.target)));

  return (
    <View style={styles.panel}>
      <PanelHeader icon="activity" label="Weekly Trend" title="Presence Momentum" />
      <View style={styles.trendBars}>
        {data.length ? data.map((item) => {
          const barHeight = spacing(24 + (item.present / maxValue) * 80);

          return (
            <View key={item.label} style={styles.trendColumn}>
              <View style={styles.trendTrack}>
                <View style={[styles.trendTarget, { bottom: `${Math.min(92, (item.target / maxValue) * 100)}%` }]} />
                <LinearGradient
                  colors={[moduleColors.accent, moduleColors.accentPressed]}
                  style={[styles.trendFill, { height: barHeight }]}
                />
              </View>
              <Text numberOfLines={1} style={styles.trendLabel}>{item.label}</Text>
            </View>
          );
        }) : (
          <EmptyMiniState text="Weekly attendance trend will appear after sync." />
        )}
      </View>
    </View>
  );
};

export const PunchTimelinePreview = ({ punches }: { punches: AttendancePunch[] }) => (
  <View style={styles.panel}>
    <PanelHeader icon="zap" label="Punch Activity" title="Today Timeline" />
    {punches.length ? punches.slice(0, 4).map((punch, index) => (
      <TimelineItem isLast={index === punches.slice(0, 4).length - 1} item={punch} key={punch.id} />
    )) : (
      <EmptyMiniState text="No punch activity recorded yet." />
    )}
  </View>
);

export const WorkModeInsights = ({ data }: { data: AttendanceWorkModeInsight[] }) => (
  <View style={styles.panel}>
    <PanelHeader icon="map-pin" label="Work Mode" title="Location Mix" />
    {data.length ? data.map((item) => (
      <View key={item.mode} style={styles.modeInsightRow}>
        <View style={styles.modeInsightLabel}>
          <Feather color={pine} name={modeIcon[item.mode]} size={spacing(16)} />
          <Text style={styles.modeInsightText}>{item.label}</Text>
        </View>
        <View style={styles.modeProgressTrack}>
          <View style={[styles.modeProgressFill, { width: `${Math.min(100, item.percentage)}%` }]} />
        </View>
        <Text style={styles.modeInsightDays}>{item.days}d</Text>
      </View>
    )) : (
      <EmptyMiniState text="Work mode split will appear once attendance is recorded." />
    )}
  </View>
);

export const InsightList = ({ insights }: { insights: AttendanceInsight[] }) => (
  <View style={styles.panel}>
    <PanelHeader icon="target" label="Insights" title="Attendance Signals" />
    {insights.length ? insights.map((insight) => (
      <View key={insight.id} style={styles.insightRow}>
        <View style={[styles.insightDot, { backgroundColor: insight.tone === 'positive' ? mint : insight.tone === 'critical' ? coral : gold }]} />
        <View style={styles.insightCopy}>
          <Text style={styles.insightTitle}>{insight.label}</Text>
          <Text style={styles.insightText}>{insight.body}</Text>
        </View>
      </View>
    )) : (
      <EmptyMiniState text="No attendance insights yet." />
    )}
  </View>
);

export const DateNavigationBar = ({
  dateLabel,
  isToday,
  onNext,
  onPrevious,
  onToday,
}: {
  dateLabel: string;
  isToday: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onToday: () => void;
}) => {
  return (
    <View style={styles.dateNav}>
      <Pressable
        accessibilityRole="button"
        onPress={onPrevious}
        style={({ pressed }) => [styles.dateNavButton, pressed && styles.pressed]}
      >
        <Feather color={pine} name="chevron-left" size={spacing(19)} />
      </Pressable>
      <View style={styles.dateNavCenter}>
        <Text style={styles.dateNavLabel}>Selected day</Text>
        <Text numberOfLines={1} style={styles.dateNavTitle}>{dateLabel}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onNext}
        style={({ pressed }) => [styles.dateNavButton, pressed && styles.pressed]}
      >
        <Feather color={pine} name="chevron-right" size={spacing(19)} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        disabled={isToday}
        onPress={onToday}
        style={({ pressed }) => [
          styles.todayButton,
          pressed && styles.pressed,
          isToday && styles.todayButtonDisabled,
        ]}
      >
        <Text style={[styles.todayText, isToday && styles.todayTextDisabled]}>Today</Text>
      </Pressable>
    </View>
  );
};

export const MonthlyInsightStrip = ({
  history,
  monthLabel,
  rate,
}: {
  history: AttendanceHistoryDay[];
  monthLabel: string;
  rate: number;
}) => {
  const insights = useMemo(() => {
    const lateCount = history.filter((item) => item.status === 'late').length;
    const wfhDays = history.filter((item) => item.workMode === 'wfh').length;
    const leaveCount = history.filter((item) => item.status === 'leave').length;
    const streak = history.reduce((count, item) => {
      if (count === -1) {
        return -1;
      }

      return ['present', 'late', 'early'].includes(item.status) ? count + 1 : -1;
    }, 0);

    return [
      { label: 'Attendance', value: `${Math.round(rate)}%` },
      { label: 'Late', value: `${lateCount}` },
      { label: 'WFH', value: `${wfhDays}` },
      { label: 'Leave', value: `${leaveCount}` },
      { label: 'Streak', value: `${Math.max(0, streak)}d` },
    ];
  }, [history, rate]);

  return (
    <View style={styles.panel}>
      <PanelHeader icon="pie-chart" label={monthLabel} title="Monthly Intelligence" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.monthlyInsightStrip}
      >
        {insights.map((item) => (
          <View key={item.label} style={styles.monthlyInsightCard}>
            <Text style={styles.monthlyInsightValue}>{item.value}</Text>
            <Text numberOfLines={1} style={styles.monthlyInsightLabel}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export const AttendanceCalendar = ({
  history,
  onSelectDate,
  selectedDate,
}: {
  history: AttendanceHistoryDay[];
  onSelectDate: (date: string) => void;
  selectedDate: string;
}) => {
  const selectedMonth = useMemo(() => getCalendarMonthMeta(selectedDate), [selectedDate]);
  const calendarMonth = useMemo(
    () => new Date(selectedMonth.year, selectedMonth.month, 1, 12),
    [selectedMonth.month, selectedMonth.year],
  );
  const recordsByDate = useMemo(() => new Map(history.map((item) => [item.date, item])), [history]);
  const calendarDays = useMemo(
    () =>
      createPremiumCalendarDays(calendarMonth, (dateKey, date, isCurrentMonth) => {
        const record =
          recordsByDate.get(dateKey) ??
          (isCurrentMonth
            ? createCalendarRecord(dateKey, date.getDate(), date.getDay())
            : undefined);
        const status = record?.status ?? 'weekend';
        const isWfh = record?.workMode === 'wfh';

        return {
          dateKey,
          dayNumber: date.getDate(),
          indicators: record
            ? [
                {
                  color: isWfh ? statusColor.present : statusColor[status],
                  id: `${dateKey}-${status}`,
                },
              ]
            : undefined,
          isCurrentMonth,
          miniLabel: isWfh ? 'WFH' : undefined,
        };
      }),
    [calendarMonth, recordsByDate],
  );

  const selectMonthOffset = (offset: number) => {
    const month = selectedMonth.month + offset;
    const year = selectedMonth.year + Math.floor(month / 12);
    const normalizedMonth = ((month % 12) + 12) % 12;
    const day = Math.min(new Date(`${selectedDate}T12:00:00`).getDate(), daysInMonth(year, normalizedMonth));

    onSelectDate(dateKeyFromParts(year, normalizedMonth, day));
  };

  return (
    <PremiumMonthCalendar
      days={calendarDays}
      label="Month View"
      legend={[
        { color: statusColor.present, label: 'Present' },
        { color: coral, label: 'Absent' },
        { color: '#f59f45', label: 'Late' },
        { color: statusColor.present, label: 'WFH' },
        { color: sky, label: 'Leave' },
        { color: statusColor.holiday, label: 'Holiday' },
      ]}
      monthLabel={selectedMonth.label}
      onNextMonth={() => selectMonthOffset(1)}
      onPreviousMonth={() => selectMonthOffset(-1)}
      onSelectDate={onSelectDate}
      selectedDate={selectedDate}
      title="Attendance Calendar"
    />
  );
};

export const SelectedDayDetailCard = ({
  day,
  isLoading,
}: {
  day: AttendanceDayDetail | null;
  isLoading: boolean;
}) => {
  if (isLoading && !day) {
    return (
      <View style={styles.panel}>
        <View style={styles.compactSkeletonLine} />
        <View style={styles.compactSkeletonBlock} />
      </View>
    );
  }

  if (!day) {
    return (
      <View style={styles.panel}>
        <EmptyMiniState text="Select a calendar date to review daily attendance details." />
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <PanelHeader icon="clipboard" label={day.dateLabel} title="Daily Details" />
      <View style={styles.dayDetailHero}>
        <View style={styles.dayDetailStatusMark}>
          <View
            style={[
              styles.dayDetailStatusDot,
              { backgroundColor: statusColor[day.status] },
            ]}
          />
        </View>
        <View style={styles.dayDetailHeroCopy}>
          <Text style={styles.dayDetailHeroValue}>
            {minutesToDuration(day.totalMinutes)}
          </Text>
          <Text style={styles.dayDetailHeroLabel}>
            {day.statusLabel} • {modeLabel[day.workMode]}
          </Text>
        </View>
      </View>
      <View style={styles.dayDetailRail}>
        <DayDetailMetric label="Clock in" value={day.firstInTime} />
        <DayDetailMetric label="Clock out" value={day.lastOutTime} />
        <DayDetailMetric
          label="Timing"
          value={
            day.lateByMinutes
              ? `${day.lateByMinutes}m late`
              : day.earlyByMinutes
                ? `${day.earlyByMinutes}m early`
                : 'On time'
          }
        />
      </View>
      <View style={styles.notesBox}>
        <Text style={styles.notesLabel}>Notes</Text>
        <Text style={styles.notesText}>{day.notes}</Text>
      </View>
      <View style={styles.embeddedTimeline}>
        {day.punches.length ? day.punches.map((item, index) => (
          <TimelineItem
            isLast={index === day.punches.length - 1}
            item={item}
            key={item.id}
          />
        )) : (
          <EmptyMiniState text="No punch timeline recorded for this day." />
        )}
      </View>
    </View>
  );
};

export const AttendanceHistoryRow = ({
  item,
  onPress,
}: {
  item: AttendanceHistoryDay;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [styles.historyRow, pressed && styles.pressed]}
  >
    <View style={styles.historyDate}>
      <Text style={styles.historyDay}>{item.dayLabel}</Text>
      <Text style={styles.historyDateText}>{item.dateLabel}</Text>
    </View>
    <View style={styles.historyMain}>
      <Text style={styles.historyStatus}>{item.statusLabel}</Text>
      <Text style={styles.historyMeta}>
        {item.firstInTime} - {item.lastOutTime} • {minutesToDuration(item.totalMinutes)}
      </Text>
    </View>
    <View style={[styles.statusPill, { backgroundColor: `${statusColor[item.status]}24` }]}>
      <View style={[styles.statusDot, { backgroundColor: statusColor[item.status] }]} />
    </View>
  </Pressable>
);

export const TimelineItem = ({
  isLast = false,
  item,
}: {
  isLast?: boolean;
  item: AttendancePunch;
}) => (
  <View style={styles.timelineRow}>
    <View style={styles.timelineRail}>
      <View style={styles.timelineNode}>
        <Feather color={deepGreen} name={item.type === 'clock-out' ? 'log-out' : 'log-in'} size={spacing(12)} />
      </View>
      {!isLast ? <View style={styles.timelineLine} /> : null}
    </View>
    <View style={styles.timelineCopy}>
      <Text style={styles.timelineTitle}>{item.label}</Text>
      <Text style={styles.timelineMeta}>{item.time} • {item.location}</Text>
    </View>
  </View>
);

export const AttendanceSkeleton = () => {
  return (
    <View style={styles.skeletonWrap}>
      <PremiumSkeleton style={styles.skeletonHero} />
      <PremiumSkeleton style={styles.skeletonRow} />
      <PremiumSkeleton style={styles.skeletonPanel} />
    </View>
  );
};

const PanelHeader = ({
  icon,
  label,
  title,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  title: string;
}) => (
  <View style={styles.panelHeader}>
    <View style={styles.panelIcon}>
      <Feather color={pine} name={icon} size={spacing(16)} />
    </View>
    <View style={styles.panelHeaderCopy}>
      <Text style={styles.panelLabel}>{label}</Text>
      <Text style={styles.panelTitle}>{title}</Text>
    </View>
  </View>
);

const EmptyMiniState = ({ text }: { text: string }) => (
  <View style={styles.emptyMini}>
    <Text style={styles.emptyMiniText}>{text}</Text>
  </View>
);

const DayDetailMetric = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.dayDetailMetric}>
    <Text numberOfLines={1} style={styles.dayDetailValue}>{value}</Text>
    <Text numberOfLines={1} style={styles.dayDetailLabel}>{label}</Text>
  </View>
);

const createCalendarRecord = (
  dateKey: string,
  dayNumber: number,
  weekday: number,
): AttendanceHistoryDay | undefined => {
  if (weekday !== 0 && weekday !== 6) {
    return undefined;
  }

  return {
    date: dateKey,
    dateLabel: `${dayNumber}`,
    dayLabel: weekday === 0 ? 'Sun' : 'Sat',
    firstInTime: '--',
    id: `calendar-weekend-${dateKey}`,
    lastOutTime: '--',
    status: 'weekend',
    statusLabel: 'Weekend',
    totalMinutes: 0,
    workMode: 'office',
  };
};

const styles = StyleSheet.create({
  calendarDay: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
    borderColor: 'rgba(190, 226, 245, 0.54)',
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(2),
    height: spacing(52),
    justifyContent: 'center',
    width: '13.1%',
  },
  calendarDayMuted: {
    opacity: 0.34,
  },
  calendarDaySelected: {
    backgroundColor: moduleColors.selected,
    borderColor: mint,
    shadowColor: mint,
    shadowOffset: { height: spacing(6), width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: spacing(12),
  },
  calendarDayText: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(17),
  },
  calendarDayTextMuted: {
    color: reactNativeColorScheme.text.disabled,
  },
  calendarDayTextSelected: {
    color: reactNativeColorScheme.text.inverse,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing(6),
  },
  calendarLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(9),
  },
  calendarMiniLabel: {
    color: pine,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(8),
    lineHeight: spacing(10),
  },
  calendarStatusDot: {
    borderRadius: radius(3),
    height: spacing(6),
    width: spacing(6),
  },
  compactSkeletonBlock: {
    backgroundColor: moduleColors.accentSoft,
    borderRadius: radius(8),
    height: spacing(108),
  },
  compactSkeletonLine: {
    backgroundColor: moduleColors.accentSoft,
    borderRadius: radius(8),
    height: spacing(28),
    width: '62%',
  },
  dateNav: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(8),
    padding: spacing(8),
  },
  dateNavButton: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(38),
    justifyContent: 'center',
    width: spacing(38),
  },
  dateNavCenter: {
    flex: 1,
    gap: spacing(1),
    minWidth: 0,
  },
  dateNavLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textTransform: 'uppercase',
  },
  dateNavTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(15),
    lineHeight: spacing(20),
  },
  dayDetailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  dayDetailHero: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    padding: spacing(14),
  },
  dayDetailHeroCopy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  dayDetailHeroLabel: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  dayDetailHeroValue: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(24),
    lineHeight: spacing(30),
  },
  dayDetailLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  dayDetailMetric: {
    backgroundColor: 'rgba(255, 255, 255, 0.64)',
    borderColor: 'rgba(190, 226, 245, 0.58)',
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(2),
    minWidth: spacing(96),
    padding: spacing(10),
  },
  dayDetailValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  dayDetailRail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  dayDetailStatusDot: {
    borderRadius: radius(9),
    height: spacing(18),
    width: spacing(18),
  },
  dayDetailStatusMark: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(44),
    justifyContent: 'center',
    width: spacing(44),
  },
  disabled: {
    opacity: 0.62,
  },
  embeddedTimeline: {
    gap: spacing(2),
  },
  emptyMini: {
    alignItems: 'center',
    backgroundColor: moduleColors.accentWash,
    borderRadius: radius(8),
    minHeight: spacing(92),
    justifyContent: 'center',
    padding: spacing(14),
  },
  emptyMiniText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
    textAlign: 'center',
  },
  hero: {
    borderRadius: radius(8),
    gap: spacing(20),
    overflow: 'hidden',
    padding: spacing(20),
    borderColor: moduleColors.borderStrong,
    borderWidth: 1,
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(16), width: 0 },
    shadowOpacity: 0.26,
    shadowRadius: spacing(24),
  },
  heroCopy: {
    flex: 1,
    gap: spacing(4),
    minWidth: 0,
  },
  heroKicker: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(16),
    textTransform: 'uppercase',
  },
  heroStat: {
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(2),
    minWidth: spacing(82),
    padding: spacing(10),
  },
  heroStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  heroStatLabel: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  heroStatValue: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(21),
  },
  heroSubtitle: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  heroTitle: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(38),
    lineHeight: spacing(44),
  },
  heroTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing(12),
    justifyContent: 'space-between',
  },
  historyDate: {
    gap: spacing(2),
    width: spacing(74),
  },
  historyDateText: {
    color: reactNativeColorScheme.text.muted,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  historyDay: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
  historyMain: {
    flex: 1,
    gap: spacing(3),
    minWidth: 0,
  },
  historyMeta: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  historyRow: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    padding: spacing(13),
  },
  historyStatus: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
  legendDot: {
    borderRadius: radius(4),
    height: spacing(8),
    width: spacing(8),
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(5),
  },
  legendText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  insightCopy: {
    flex: 1,
    gap: spacing(2),
  },
  insightDot: {
    borderRadius: radius(4),
    height: spacing(8),
    marginTop: spacing(5),
    width: spacing(8),
  },
  insightRow: {
    flexDirection: 'row',
    gap: spacing(10),
  },
  insightText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  insightTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  metricCard: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(4),
    minWidth: spacing(128),
    padding: spacing(13),
  },
  metricIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(30),
    justifyContent: 'center',
    width: spacing(30),
  },
  metricLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  metricStrip: {
    gap: spacing(10),
    paddingRight: spacing(4),
  },
  metricValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(21),
    lineHeight: spacing(27),
  },
  modeChip: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(7),
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(10),
  },
  heroContext: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  modeChipText: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  modeInsightDays: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
    width: spacing(32),
  },
  modeInsightLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(8),
    width: spacing(92),
  },
  modeInsightRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(10),
  },
  modeInsightText: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansSemiBold,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  modeProgressFill: {
    backgroundColor: mint,
    borderRadius: radius(8),
    height: '100%',
  },
  modeProgressTrack: {
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    flex: 1,
    height: spacing(9),
    overflow: 'hidden',
  },
  monthDropdown: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(5),
    minHeight: spacing(32),
    paddingHorizontal: spacing(9),
  },
  monthDropdownText: {
    color: pine,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    maxWidth: spacing(72),
  },
  monthOption: {
    alignItems: 'center',
    backgroundColor: moduleColors.surfaceRaised,
    borderColor: 'rgba(190, 226, 245, 0.7)',
    borderRadius: radius(8),
    borderWidth: 1,
    minHeight: spacing(34),
    justifyContent: 'center',
    paddingHorizontal: spacing(10),
    width: '22.8%',
  },
  monthOptionSelected: {
    backgroundColor: moduleColors.selected,
    borderColor: mint,
  },
  monthOptionText: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  monthOptionTextSelected: {
    color: reactNativeColorScheme.text.inverse,
  },
  monthPicker: {
    backgroundColor: moduleColors.accentWash,
    borderRadius: radius(8),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(7),
    padding: spacing(9),
  },
  monthlyInsightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.68)',
    borderColor: 'rgba(190, 226, 245, 0.64)',
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(2),
    minWidth: spacing(92),
    padding: spacing(10),
  },
  monthlyInsightLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  monthlyInsightStrip: {
    gap: spacing(8),
    paddingRight: spacing(2),
  },
  monthlyInsightValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(18),
    lineHeight: spacing(23),
  },
  notesBox: {
    backgroundColor: moduleColors.accentWash,
    borderRadius: radius(8),
    gap: spacing(3),
    padding: spacing(12),
  },
  notesLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textTransform: 'uppercase',
  },
  notesText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.66)',
    borderColor: 'rgba(190, 226, 245, 0.68)',
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(14),
    padding: spacing(14),
    shadowColor: reactNativeColorScheme.ultiHuman.surface.cardShadow,
    shadowOffset: { height: spacing(10), width: 0 },
    shadowOpacity: 0.11,
    shadowRadius: spacing(16),
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(10),
  },
  panelHeaderCopy: {
    flex: 1,
    gap: spacing(1),
  },
  panelIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(34),
    justifyContent: 'center',
    width: spacing(34),
  },
  panelLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(16),
    lineHeight: spacing(21),
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  punchButton: {
    alignItems: 'center',
    backgroundColor: mint,
    borderRadius: radius(8),
    flexDirection: 'row',
    gap: spacing(8),
    justifyContent: 'center',
    minHeight: spacing(46),
    paddingHorizontal: spacing(18),
  },
  punchButtonText: {
    color: deepGreen,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  punchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(10),
    justifyContent: 'space-between',
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: radius(8),
    flex: 1,
    flexDirection: 'row',
    gap: spacing(7),
    justifyContent: 'center',
    minHeight: spacing(42),
  },
  segmentButtonSelected: {
    backgroundColor: mint,
  },
  segmentText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  segmentTextSelected: {
    color: deepGreen,
  },
  segmentWrap: {
    backgroundColor: 'rgba(255, 255, 255, 0.74)',
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(6),
    padding: spacing(5),
  },
  skeletonHero: {
    backgroundColor: moduleColors.accentSoft,
    borderRadius: radius(8),
    height: spacing(210),
  },
  skeletonPanel: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderRadius: radius(8),
    height: spacing(154),
  },
  skeletonRow: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderRadius: radius(8),
    height: spacing(72),
  },
  skeletonWrap: {
    gap: spacing(14),
  },
  statusDot: {
    borderRadius: radius(5),
    height: spacing(10),
    width: spacing(10),
  },
  statusOrb: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    minWidth: spacing(76),
    padding: spacing(10),
  },
  statusOrbLabel: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
  },
  statusOrbValue: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(20),
    lineHeight: spacing(25),
  },
  statusPill: {
    alignItems: 'center',
    borderRadius: radius(8),
    height: spacing(32),
    justifyContent: 'center',
    width: spacing(32),
  },
  timelineCopy: {
    flex: 1,
    gap: spacing(2),
    paddingBottom: spacing(8),
  },
  timelineLine: {
    backgroundColor: 'rgba(42, 153, 213, 0.16)',
    flex: 1,
    width: spacing(2),
  },
  timelineMeta: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  timelineNode: {
    alignItems: 'center',
    backgroundColor: mint,
    borderRadius: radius(14),
    height: spacing(28),
    justifyContent: 'center',
    width: spacing(28),
  },
  timelineRail: {
    alignItems: 'center',
    alignSelf: 'stretch',
    width: spacing(32),
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing(10),
    minHeight: spacing(62),
  },
  timelineTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
  todayButton: {
    alignItems: 'center',
    backgroundColor: mint,
    borderRadius: radius(8),
    justifyContent: 'center',
    minHeight: spacing(38),
    paddingHorizontal: spacing(12),
  },
  todayButtonDisabled: {
    backgroundColor: moduleColors.accentSoft,
  },
  todayText: {
    color: deepGreen,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  todayTextDisabled: {
    color: reactNativeColorScheme.text.secondary,
  },
  trendBars: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: spacing(10),
    minHeight: spacing(148),
  },
  trendColumn: {
    alignItems: 'center',
    flex: 1,
    gap: spacing(6),
  },
  trendFill: {
    borderRadius: radius(8),
    width: '100%',
  },
  trendLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  trendTarget: {
    backgroundColor: gold,
    height: spacing(2),
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },
  trendTrack: {
    backgroundColor: moduleColors.accentWash,
    borderRadius: radius(8),
    height: spacing(126),
    justifyContent: 'flex-end',
    overflow: 'hidden',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(3),
    width: '100%',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(6),
  },
  weekdayText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textAlign: 'center',
    width: '13.1%',
  },
});
