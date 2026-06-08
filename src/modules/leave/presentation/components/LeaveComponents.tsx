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
  PremiumMonthCalendar,
  PremiumSkeleton,
  type PremiumCalendarIndicator,
} from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type {
  LeaveBalance,
  LeaveCalendarDay,
  LeaveDayPart,
  LeaveInsight,
  LeaveRequest,
  LeaveTrendPoint,
  LeaveType,
  TeamLeave,
} from '@/modules/leave/domain/entities/Leave';
import { leaveTypeLabel } from '@/modules/leave/domain/entities/Leave';
import { isLeaveExcludedDate } from '@/modules/leave/domain/services/leaveDateRange';
import { fontSize, radius, spacing } from '@/utils/scale';

const surface = reactNativeColorScheme.ultiHuman.surface;
const moduleColors = reactNativeColorScheme.ultiHuman.module;
const text = reactNativeColorScheme.ultiHuman.text;

export const formatLeaveDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${value}T12:00:00`));

export const formatLeaveDateLong = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    weekday: 'short',
  }).format(new Date(`${value}T12:00:00`));

export const getDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const leaveTypeColor: Record<LeaveType, string> = {
  casual: '#22c55e',
  'comp-off': '#14b8a6',
  earned: moduleColors.accentPressed,
  'maternity-paternity': '#a855f7',
  sick: '#ef4444',
  unpaid: '#64748b',
  'work-from-home': '#0284c7',
};

const statusColor: Record<LeaveRequest['status'], string> = {
  approved: moduleColors.accentPressed,
  cancelled: '#64748b',
  draft: '#64748b',
  pending: '#d97706',
  rejected: '#dc2626',
};

const dayPartLabel: Record<LeaveDayPart, string> = {
  'first-half': 'First half',
  'full-day': 'Full day',
  'second-half': 'Second half',
};

export const leaveTypeOptions = (Object.keys(leaveTypeLabel) as LeaveType[]).filter(
  (type) => type !== 'work-from-home',
);
export const leaveDayPartOptions = Object.keys(dayPartLabel) as LeaveDayPart[];

export const LeaveHeroCard = ({
  availableDays,
  nextLeave,
  pendingCount,
  protectedDays,
}: {
  availableDays: number;
  nextLeave: LeaveRequest | null;
  pendingCount: number;
  protectedDays: number;
}) => (
  <LinearGradient
    colors={moduleColors.heroGradient}
    end={{ x: 1, y: 1 }}
    start={{ x: 0, y: 0 }}
    style={styles.hero}
  >
    <View style={styles.heroTop}>
      <View>
        <Text style={styles.heroEyebrow}>Leave readiness</Text>
        <Text style={styles.heroTitle}>{availableDays.toFixed(1)} days</Text>
      </View>
      <View style={styles.heroBadge}>
        <Feather color={moduleColors.icon} name="shield" size={spacing(16)} />
        <Text style={styles.heroBadgeText}>{protectedDays} protected</Text>
      </View>
    </View>
    <Text style={styles.heroCopy}>
      {nextLeave
        ? `${leaveTypeLabel[nextLeave.type]} starts ${formatLeaveDateLong(nextLeave.startDate)}.`
        : 'No upcoming leave. Your calendar has room for planned recovery.'}
    </Text>
    <View style={styles.heroStats}>
      <HeroMini label="Pending" value={`${pendingCount}`} />
      <HeroMini label="Next" value={nextLeave ? formatLeaveDate(nextLeave.startDate) : 'Open'} />
      <HeroMini label="Mode" value="API ready" />
    </View>
  </LinearGradient>
);

const HeroMini = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.heroMini}>
    <Text style={styles.heroMiniLabel}>{label}</Text>
    <Text style={styles.heroMiniValue}>{value}</Text>
  </View>
);

export const LeaveQuickAction = ({
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
    style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}
  >
    <View style={styles.quickIcon}>
      <Feather color={moduleColors.icon} name={icon} size={spacing(17)} />
    </View>
    <Text numberOfLines={1} style={styles.quickText}>
      {label}
    </Text>
  </Pressable>
);

export const LeaveBalanceRail = ({ balances }: { balances: LeaveBalance[] }) => (
  <View style={styles.section}>
    <SectionTitle title="Balances" />
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.balanceRail}
    >
      {balances.map((balance) => {
        const ratio = balance.total > 0 ? balance.available / balance.total : 0;

        return (
          <View key={balance.type} style={styles.balanceCard}>
            <View style={[styles.typeDot, { backgroundColor: leaveTypeColor[balance.type] }]} />
            <Text numberOfLines={1} style={styles.balanceLabel}>
              {balance.label}
            </Text>
            <Text style={styles.balanceValue}>{balance.available.toFixed(1)}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(100, ratio * 100)}%` }]} />
            </View>
            <Text style={styles.balanceMeta}>
              {balance.booked.toFixed(1)} booked
            </Text>
          </View>
        );
      })}
    </ScrollView>
  </View>
);

export const LeaveCalendarCard = ({
  calendar,
  month,
  onChangeMonth,
  onSelectDate,
  selectedDate,
}: {
  calendar: LeaveCalendarDay[];
  month: Date;
  onChangeMonth?: (offset: number) => void;
  onSelectDate: (date: string) => void;
  selectedDate: string;
}) => {
  const eventMap = useMemo(
    () => new Map(calendar.map((day) => [day.date, day])),
    [calendar],
  );
  const monthKey = getDateKey(new Date(month.getFullYear(), month.getMonth(), 1, 12));
  const monthMeta = useMemo(() => getCalendarMonthMeta(monthKey), [monthKey]);
  const calendarDays = useMemo(
    () =>
      createPremiumCalendarDays(month, (dateValue, date, isCurrentMonth) => {
        const day = eventMap.get(dateValue);
        const requestIndicators =
          day?.requests.map((request): PremiumCalendarIndicator => ({
            color:
              request.status === 'pending'
                ? '#d97706'
                : request.status === 'rejected'
                  ? reactNativeColorScheme.status.danger.strong
                  : leaveTypeColor[request.type],
            id: request.id,
          })) ?? [];
        const holidayIndicator = day?.holiday
          ? [{ color: '#f59e0b', id: day.holiday.id }]
          : [];
        const teamIndicators = day?.teamLeaves.length
          ? [{ color: '#0284c7', id: `${dateValue}-team` }]
          : [];
        const halfDayRequest = day?.requests.find((request) => request.dayPart !== 'full-day');

        return {
          dateKey: dateValue,
          dayNumber: date.getDate(),
          indicators: [...requestIndicators, ...holidayIndicator, ...teamIndicators],
          isCurrentMonth,
          miniLabel: halfDayRequest ? 'Half' : undefined,
        };
      }),
    [eventMap, month],
  );

  const selectMonthOffset = (offset: number) => {
    if (!onChangeMonth) {
      return;
    }

    onChangeMonth(offset);
  };

  return (
    <PremiumMonthCalendar
      days={calendarDays}
      label="Month View"
      legend={[
        { color: moduleColors.accentPressed, label: 'Approved' },
        { color: '#d97706', label: 'Pending' },
        { color: reactNativeColorScheme.status.danger.strong, label: 'Rejected' },
        { color: '#f59e0b', label: 'Holiday' },
        { color: '#0284c7', label: 'Team' },
      ]}
      monthLabel={monthMeta.label}
      onNextMonth={onChangeMonth ? () => selectMonthOffset(1) : undefined}
      onPreviousMonth={onChangeMonth ? () => selectMonthOffset(-1) : undefined}
      onSelectDate={onSelectDate}
      selectedDate={selectedDate}
      title="Leave Calendar"
    />
  );
};

export const LeaveDateRangeCalendar = ({
  calendar,
  endDate,
  isDateDisabled,
  month,
  onChangeMonth,
  onSelectDate,
  selectedDate,
  startDate,
}: {
  calendar: LeaveCalendarDay[];
  endDate: string;
  isDateDisabled?: (date: string) => boolean;
  month: Date;
  onChangeMonth: (offset: number) => void;
  onSelectDate: (date: string) => void;
  selectedDate: string;
  startDate: string;
}) => {
  const eventMap = useMemo(
    () => new Map(calendar.map((day) => [day.date, day])),
    [calendar],
  );
  const monthKey = getDateKey(new Date(month.getFullYear(), month.getMonth(), 1, 12));
  const monthMeta = useMemo(() => getCalendarMonthMeta(monthKey), [monthKey]);
  const calendarDays = useMemo(
    () =>
      createPremiumCalendarDays(month, (dateValue, date, isCurrentMonth) => {
        const day = eventMap.get(dateValue);
        const requestIndicators =
          day?.requests.map((request): PremiumCalendarIndicator => ({
            color: statusColor[request.status],
            id: request.id,
          })) ?? [];
        const holidayIndicator = day?.holiday
          ? [{ color: '#f59e0b', id: day.holiday.id }]
          : [];
        const teamIndicators = day?.teamLeaves.length
          ? [{ color: '#0284c7', id: `${dateValue}-team` }]
          : [];
        const isBlocked = isDateDisabled?.(dateValue) ?? false;
        const isWeeklyOff = isLeaveExcludedDate(dateValue);

        return {
          dateKey: dateValue,
          dayNumber: date.getDate(),
          indicators: [
            ...requestIndicators,
            ...holidayIndicator,
            ...teamIndicators,
            ...(isWeeklyOff ? [{ color: '#94a3b8', id: `${dateValue}-sunday` }] : []),
          ],
          isCurrentMonth,
          miniLabel: isBlocked ? 'Booked' : isWeeklyOff ? 'Sun' : day?.holiday ? 'Holiday' : undefined,
        };
      }),
    [eventMap, isDateDisabled, month],
  );

  return (
    <PremiumMonthCalendar
      days={calendarDays}
      isDateDisabled={isDateDisabled}
      isDateExcluded={isLeaveExcludedDate}
      label="Date range"
      legend={[
        { color: moduleColors.accentPressed, label: 'Selected' },
        { color: '#d97706', label: 'Pending' },
        { color: '#f59e0b', label: 'Holiday' },
        { color: '#0284c7', label: 'Team' },
        { color: '#94a3b8', label: 'Sunday' },
      ]}
      monthLabel={monthMeta.label}
      onNextMonth={() => onChangeMonth(1)}
      onPreviousMonth={() => onChangeMonth(-1)}
      onSelectDate={onSelectDate}
      rangeEndDate={endDate}
      rangeStartDate={startDate}
      selectedDate={selectedDate}
      title="Select Leave Dates"
    />
  );
};

export const getMonthDateFromSelectedDate = (selectedDate: string): Date => {
  const [yearValue, monthValue] = selectedDate.split('-').map(Number);

  return new Date(yearValue, (monthValue || 1) - 1, 1, 12);
};

export const getDateForMonthOffset = (selectedDate: string, offset: number): string => {
  const [yearValue, monthValue, dayValue] = selectedDate.split('-').map(Number);
  const month = (monthValue || 1) - 1 + offset;
  const year = (yearValue || new Date().getFullYear()) + Math.floor(month / 12);
  const normalizedMonth = ((month % 12) + 12) % 12;
  const day = Math.min(dayValue || 1, daysInMonth(year, normalizedMonth));

  return dateKeyFromParts(year, normalizedMonth, day);
};

export const SelectedLeaveDayPanel = ({
  day,
  selectedDate,
}: {
  day?: LeaveCalendarDay;
  selectedDate: string;
}) => (
  <View style={styles.section}>
    <SectionTitle subtitle={formatLeaveDateLong(selectedDate)} title="Selected day" />
    <View style={styles.detailSurface}>
      {day?.requests.length ? (
        day.requests.map((request) => <LeaveRequestRow key={request.id} request={request} />)
      ) : (
        <EmptyLine icon="coffee" text="No leave request on this date." />
      )}
      {day?.holiday ? <EmptyLine icon="gift" text={day.holiday.label} /> : null}
      {day?.teamLeaves.map((leave) => (
        <TeamLeaveRow key={leave.id} leave={leave} />
      ))}
    </View>
  </View>
);

export const LeaveRequestRow = ({
  onPress,
  request,
}: {
  onPress?: () => void;
  request: LeaveRequest;
}) => (
  <Pressable
    accessibilityRole={onPress ? 'button' : undefined}
    disabled={!onPress}
    onPress={onPress}
    style={({ pressed }) => [styles.requestRow, pressed && styles.pressed]}
  >
    <View style={[styles.requestIcon, { backgroundColor: `${leaveTypeColor[request.type]}22` }]}>
      <Feather color={leaveTypeColor[request.type]} name="calendar" size={spacing(17)} />
    </View>
    <View style={styles.requestContent}>
      <Text numberOfLines={1} style={styles.requestTitle}>
        {request.title}
      </Text>
      <Text style={styles.requestMeta}>
        {formatLeaveDate(request.startDate)} - {formatLeaveDate(request.endDate)} - {request.days}d
      </Text>
    </View>
    <Text style={[styles.statusPill, { color: statusColor[request.status] }]}>
      {request.statusLabel}
    </Text>
  </Pressable>
);

export const TeamLeaveRow = ({ leave }: { leave: TeamLeave }) => (
  <View style={styles.teamRow}>
    <Feather color={leaveTypeColor[leave.type]} name="users" size={spacing(16)} />
    <Text numberOfLines={1} style={styles.teamText}>
      {leave.employeeName} - {leaveTypeLabel[leave.type]}
    </Text>
  </View>
);

export const LeaveInsightsPanel = ({ insights }: { insights: LeaveInsight[] }) => (
  <View style={styles.section}>
    <SectionTitle title="Insights" />
    <View style={styles.insightStack}>
      {insights.map((insight) => (
        <View key={insight.id} style={styles.insightCard}>
          <Feather
            color={insight.tone === 'warning' ? '#d97706' : moduleColors.icon}
            name={insight.tone === 'warning' ? 'alert-circle' : 'zap'}
            size={spacing(18)}
          />
          <View style={styles.insightBody}>
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightCopy}>{insight.body}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

export const LeaveAnalyticsPreview = ({
  approvalRate,
  monthlyUsage,
}: {
  approvalRate: number;
  monthlyUsage: LeaveTrendPoint[];
}) => {
  const max = Math.max(1, ...monthlyUsage.map((point) => point.used));

  return (
    <View style={styles.section}>
      <SectionTitle subtitle={`${approvalRate}% approval rate`} title="Usage trend" />
      <View style={styles.chartRow}>
        {monthlyUsage.map((point) => (
          <View key={point.label} style={styles.chartItem}>
            <View style={styles.chartTrack}>
              <View style={[styles.chartFill, { height: `${(point.used / max) * 100}%` }]} />
            </View>
            <Text style={styles.chartLabel}>{point.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export const LeaveTimeline = ({ request }: { request: LeaveRequest }) => (
  <View style={styles.section}>
    <SectionTitle title="Approval timeline" />
    <View style={styles.timeline}>
      {request.timeline.map((event, index) => (
        <View key={event.id} style={styles.timelineRow}>
          <View style={styles.timelineRail}>
            <View style={styles.timelineDot} />
            {index < request.timeline.length - 1 ? <View style={styles.timelineLine} /> : null}
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineLabel}>{event.label}</Text>
            <Text style={styles.timelineTime}>{event.at}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

export const LeaveTypeSelector = ({
  onChange,
  value,
}: {
  onChange: (value: LeaveType) => void;
  value: LeaveType;
}) => (
  <View style={styles.optionGrid}>
    {leaveTypeOptions.map((type) => (
      <SelectablePill
        key={type}
        label={leaveTypeLabel[type]}
        onPress={() => onChange(type)}
        selected={value === type}
      />
    ))}
  </View>
);

export const LeaveDayPartSelector = ({
  onChange,
  value,
}: {
  onChange: (value: LeaveDayPart) => void;
  value: LeaveDayPart;
}) => (
  <View style={styles.segmentRow}>
    {leaveDayPartOptions.map((part) => (
      <SelectablePill
        key={part}
        label={dayPartLabel[part]}
        onPress={() => onChange(part)}
        selected={value === part}
      />
    ))}
  </View>
);

const SelectablePill = ({
  label,
  onPress,
  selected,
}: {
  label: string;
  onPress: () => void;
  selected: boolean;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [
      styles.selectablePill,
      selected && styles.selectablePillSelected,
      pressed && styles.pressed,
    ]}
  >
    <Text style={[styles.selectableText, selected && styles.selectableTextSelected]}>
      {label}
    </Text>
  </Pressable>
);

export const LeaveSkeleton = () => (
  <View style={styles.skeletonStack}>
    {[0, 1, 2, 3].map((item) => (
      <PremiumSkeleton key={item} style={styles.skeletonBlock} />
    ))}
  </View>
);

const SectionTitle = ({ subtitle, title }: { subtitle?: string; title: string }) => (
  <View style={styles.sectionTitleWrap}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
  </View>
);

const EmptyLine = ({ icon, text: lineText }: { icon: keyof typeof Feather.glyphMap; text: string }) => (
  <View style={styles.emptyLine}>
    <Feather color={moduleColors.icon} name={icon} size={spacing(16)} />
    <Text style={styles.emptyText}>{lineText}</Text>
  </View>
);

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(5),
    minHeight: spacing(132),
    padding: spacing(13),
    width: spacing(142),
  },
  balanceLabel: {
    color: text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  balanceMeta: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  balanceRail: {
    gap: spacing(10),
    paddingRight: spacing(8),
  },
  balanceValue: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(24),
    lineHeight: spacing(30),
  },
  calendarCell: {
    alignItems: 'center',
    borderRadius: radius(8),
    height: spacing(44),
    justifyContent: 'center',
    width: `${100 / 7}%`,
  },
  calendarCellSelected: {
    backgroundColor: moduleColors.selected,
  },
  calendarDate: {
    color: text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(17),
  },
  calendarDateSelected: {
    color: moduleColors.selectedText,
  },
  calendarDot: {
    borderRadius: radius(3),
    height: spacing(5),
    width: spacing(5),
  },
  calendarDots: {
    flexDirection: 'row',
    gap: spacing(2),
    minHeight: spacing(7),
    paddingTop: spacing(2),
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing(4),
  },
  chartFill: {
    backgroundColor: moduleColors.accent,
    borderRadius: radius(5),
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  chartItem: {
    alignItems: 'center',
    flex: 1,
    gap: spacing(6),
  },
  chartLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
  },
  chartRow: {
    alignItems: 'flex-end',
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(10),
    minHeight: spacing(160),
    padding: spacing(14),
  },
  chartTrack: {
    backgroundColor: moduleColors.accentWash,
    borderRadius: radius(5),
    height: spacing(104),
    overflow: 'hidden',
    width: spacing(16),
  },
  detailSurface: {
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(9),
    padding: spacing(12),
  },
  emptyLine: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(8),
    minHeight: spacing(36),
  },
  emptyText: {
    color: reactNativeColorScheme.text.secondary,
    flex: 1,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  hero: {
    borderColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(15),
    overflow: 'hidden',
    padding: spacing(18),
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: spacing(12), width: 0 },
    shadowOpacity: 0.13,
    shadowRadius: spacing(20),
  },
  heroBadge: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroOverlay,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(6),
    paddingHorizontal: spacing(10),
    paddingVertical: spacing(7),
  },
  heroBadgeText: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  heroCopy: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(13),
    lineHeight: spacing(19),
  },
  heroEyebrow: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    letterSpacing: 0,
    lineHeight: spacing(15),
    textTransform: 'uppercase',
  },
  heroMini: {
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(2),
    padding: spacing(10),
  },
  heroMiniLabel: {
    color: moduleColors.softText,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
  },
  heroMiniValue: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(17),
  },
  heroStats: {
    flexDirection: 'row',
    gap: spacing(8),
  },
  heroTitle: {
    color: moduleColors.heroText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(30),
    lineHeight: spacing(36),
  },
  heroTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  holidayDot: {
    backgroundColor: '#f59e0b',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(34),
    justifyContent: 'center',
    width: spacing(34),
  },
  insightBody: {
    flex: 1,
    gap: spacing(3),
  },
  insightCard: {
    alignItems: 'flex-start',
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(10),
    padding: spacing(12),
  },
  insightCopy: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  insightStack: {
    gap: spacing(9),
  },
  insightTitle: {
    color: text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  legendDot: {
    borderRadius: radius(4),
    height: spacing(7),
    width: spacing(7),
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(5),
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(12),
    paddingTop: spacing(6),
  },
  legendText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  monthControls: {
    flexDirection: 'row',
    gap: spacing(7),
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  progressFill: {
    backgroundColor: moduleColors.accent,
    borderRadius: radius(4),
    height: '100%',
  },
  progressTrack: {
    backgroundColor: moduleColors.accentWash,
    borderRadius: radius(4),
    height: spacing(7),
    overflow: 'hidden',
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(8),
    minHeight: spacing(52),
    minWidth: spacing(126),
    paddingHorizontal: spacing(12),
  },
  quickIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(30),
    justifyContent: 'center',
    width: spacing(30),
  },
  quickText: {
    color: text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  requestContent: {
    flex: 1,
    gap: spacing(2),
  },
  requestIcon: {
    alignItems: 'center',
    borderRadius: radius(8),
    height: spacing(34),
    justifyContent: 'center',
    width: spacing(34),
  },
  requestMeta: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  requestRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(10),
    minHeight: spacing(52),
  },
  requestTitle: {
    color: text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  section: {
    gap: spacing(11),
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionKicker: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  sectionTitle: {
    color: text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(17),
    lineHeight: spacing(22),
  },
  sectionTitleWrap: {
    gap: spacing(2),
  },
  selectablePill: {
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    minHeight: spacing(38),
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(9),
  },
  selectablePillSelected: {
    backgroundColor: moduleColors.selected,
    borderColor: moduleColors.selected,
  },
  selectableText: {
    color: text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  selectableTextSelected: {
    color: moduleColors.selectedText,
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(8),
  },
  skeletonBlock: {
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    height: spacing(122),
  },
  skeletonStack: {
    gap: spacing(12),
  },
  statusPill: {
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  teamDot: {
    backgroundColor: '#0284c7',
  },
  teamRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(8),
    minHeight: spacing(34),
  },
  teamText: {
    color: text,
    flex: 1,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  timeline: {
    backgroundColor: surface.glassPanel,
    borderColor: surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    padding: spacing(12),
  },
  timelineContent: {
    flex: 1,
    gap: spacing(2),
    paddingBottom: spacing(14),
  },
  timelineDot: {
    backgroundColor: moduleColors.accent,
    borderRadius: radius(5),
    height: spacing(10),
    width: spacing(10),
  },
  timelineLabel: {
    color: text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  timelineLine: {
    backgroundColor: moduleColors.accentSoft,
    flex: 1,
    width: 1,
  },
  timelineRail: {
    alignItems: 'center',
    width: spacing(18),
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing(8),
  },
  timelineTime: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  typeDot: {
    borderRadius: radius(5),
    height: spacing(10),
    width: spacing(10),
  },
  weekDay: {
    color: reactNativeColorScheme.text.secondary,
    flex: 1,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
  },
});
