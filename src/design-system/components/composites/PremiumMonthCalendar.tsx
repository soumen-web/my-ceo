import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import { fontSize, radius, spacing } from '@/utils/scale';

export interface PremiumCalendarIndicator {
  color: string;
  id: string;
}

export interface PremiumCalendarDay {
  dateKey: string;
  dayNumber: number;
  indicators?: PremiumCalendarIndicator[];
  isCurrentMonth: boolean;
  miniLabel?: string;
}

export interface PremiumCalendarLegendItem {
  color: string;
  label: string;
}

interface PremiumMonthCalendarProps {
  days: PremiumCalendarDay[];
  isDateDisabled?: (date: string) => boolean;
  isDateExcluded?: (date: string) => boolean;
  label: string;
  legend: PremiumCalendarLegendItem[];
  monthLabel: string;
  onNextMonth?: () => void;
  onPreviousMonth?: () => void;
  onSelectDate: (date: string) => void;
  rangeEndDate?: string;
  rangeStartDate?: string;
  selectedDate: string;
  title: string;
}

const moduleColors = reactNativeColorScheme.ultiHuman.module;
const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const dateKeyFromDate = (date: Date): string =>
  dateKeyFromParts(date.getFullYear(), date.getMonth(), date.getDate());

export const dateKeyFromParts = (
  year: number,
  month: number,
  day: number,
): string => {
  const formattedMonth = `${month + 1}`.padStart(2, '0');
  const formattedDay = `${day}`.padStart(2, '0');

  return `${year}-${formattedMonth}-${formattedDay}`;
};

export const parseDateKey = (
  dateKey: string,
): { day: number; month: number; year: number } => {
  const [yearValue, monthValue, dayValue] = dateKey.split('-').map(Number);

  return {
    day: Number.isFinite(dayValue) ? dayValue : 1,
    month: Number.isFinite(monthValue) ? monthValue - 1 : new Date().getMonth(),
    year: Number.isFinite(yearValue) ? yearValue : new Date().getFullYear(),
  };
};

export const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

export const getCalendarMonthMeta = (dateKey: string) => {
  const { month, year } = parseDateKey(dateKey);
  const date = new Date(year, month, 1, 12);

  return {
    label: new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      year: 'numeric',
    }).format(date),
    month,
    year,
  };
};

export const createPremiumCalendarDays = (
  monthDate: Date,
  getDay: (dateKey: string, date: Date, isCurrentMonth: boolean) => PremiumCalendarDay,
): PremiumCalendarDay[] => {
  const month = monthDate.getMonth();
  const year = monthDate.getFullYear();
  const firstOfMonth = new Date(year, month, 1, 12);
  const firstWeekday = firstOfMonth.getDay();
  const startDate = new Date(firstOfMonth);
  startDate.setDate(firstOfMonth.getDate() - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const dateKey = dateKeyFromDate(date);

    return getDay(dateKey, date, date.getMonth() === month);
  });
};

export const PremiumMonthCalendar = ({
  days,
  isDateDisabled,
  isDateExcluded,
  label,
  legend,
  monthLabel,
  onNextMonth,
  onPreviousMonth,
  onSelectDate,
  rangeEndDate,
  rangeStartDate,
  selectedDate,
  title,
}: PremiumMonthCalendarProps) => {
  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={styles.panelIcon}>
          <Feather color={moduleColors.icon} name="calendar" size={spacing(16)} />
        </View>
        <View style={styles.panelHeaderCopy}>
          <Text numberOfLines={1} style={styles.panelLabel}>{label}</Text>
          <Text numberOfLines={1} style={styles.panelTitle}>{title}</Text>
        </View>
        <View style={styles.monthNav}>
          {onPreviousMonth ? (
            <MonthNavButton icon="chevron-left" onPress={onPreviousMonth} />
          ) : null}
          <Text numberOfLines={1} style={styles.monthLabel}>
            {monthLabel}
          </Text>
          {onNextMonth ? <MonthNavButton icon="chevron-right" onPress={onNextMonth} /> : null}
        </View>
      </View>

      <View style={styles.weekdayRow}>
        {weekDays.map((item, index) => (
          <Text key={`${item}-${index}`} style={styles.weekdayText}>
            {item}
          </Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {days.map((day) => {
          const isDateBlocked = isDateDisabled?.(day.dateKey) ?? false;
          const isExcluded = isDateExcluded?.(day.dateKey) ?? false;
          const isRangeStart = day.dateKey === rangeStartDate;
          const isRangeEnd = day.dateKey === rangeEndDate;
          const isRangeEdge = isRangeStart || isRangeEnd;
          const isInRange =
            Boolean(rangeStartDate && rangeEndDate) &&
            day.dateKey >= rangeStartDate! &&
            day.dateKey <= rangeEndDate!;
          const isRangeMiddle = isInRange && !isRangeEdge;
          const isSingleDayRange = isRangeStart && isRangeEnd;
          const isSelected = day.dateKey === selectedDate || isRangeEdge;
          const isDisabled = !day.isCurrentMonth || isDateBlocked;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isDisabled, selected: isSelected }}
              disabled={isDisabled}
              key={day.dateKey}
              onPress={() => onSelectDate(day.dateKey)}
              style={({ pressed }) => [
                styles.calendarDay,
                !day.isCurrentMonth && styles.calendarDayMuted,
                isDateBlocked && styles.calendarDayDisabled,
                pressed && styles.pressed,
              ]}
            >
              {isInRange ? (
                <View
                  pointerEvents="none"
                  style={[
                    styles.rangeBridge,
                    isRangeMiddle && styles.rangeBridgeMiddle,
                    isRangeStart && !isSingleDayRange && styles.rangeBridgeStart,
                    isRangeEnd && !isSingleDayRange && styles.rangeBridgeEnd,
                    isSingleDayRange && styles.rangeBridgeSingle,
                    isExcluded && styles.rangeBridgeExcluded,
                  ]}
                />
              ) : null}
              <View
                style={[
                  styles.calendarDayContent,
                  isRangeMiddle && styles.calendarDayContentRange,
                  isExcluded && isRangeMiddle && styles.calendarDayContentExcluded,
                  isSelected && styles.calendarDayContentSelected,
                ]}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    !day.isCurrentMonth && styles.calendarDayTextMuted,
                    isDateBlocked && styles.calendarDayTextMuted,
                    isExcluded && styles.calendarDayTextExcluded,
                    isSelected && styles.calendarDayTextSelected,
                  ]}
                >
                  {day.dayNumber}
                </Text>
                {day.indicators?.length ? (
                  <View style={styles.indicatorRow}>
                    {day.indicators.slice(0, 3).map((indicator) => (
                      <View
                        key={indicator.id}
                        style={[
                          styles.calendarStatusDot,
                          { backgroundColor: indicator.color },
                          isSelected && styles.calendarStatusDotSelected,
                        ]}
                      />
                    ))}
                  </View>
                ) : null}
                {day.miniLabel ? (
                  <Text
                    style={[
                      styles.calendarMiniLabel,
                      isSelected && styles.calendarMiniLabelSelected,
                    ]}
                  >
                    {day.miniLabel}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.calendarLegend}>
        {legend.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const MonthNavButton = ({
  icon,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [styles.monthNavButton, pressed && styles.pressed]}
  >
    <Feather color={moduleColors.icon} name={icon} size={spacing(16)} />
  </Pressable>
);

const styles = StyleSheet.create({
  calendarDay: {
    alignItems: 'center',
    height: spacing(52),
    justifyContent: 'center',
    overflow: 'visible',
    position: 'relative',
    width: '14.285%',
  },
  calendarDayContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderColor: 'rgba(190, 226, 245, 0.54)',
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(2),
    height: spacing(44),
    justifyContent: 'center',
    width: spacing(44),
    zIndex: 2,
  },
  calendarDayContentExcluded: {
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
  },
  calendarDayContentRange: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  calendarDayContentSelected: {
    backgroundColor: moduleColors.selected,
    borderColor: moduleColors.accent,
    borderRadius: radius(22),
    borderStyle: 'solid',
    shadowColor: moduleColors.accent,
    shadowOffset: { height: spacing(6), width: 0 },
    shadowOpacity: 0.22,
    shadowRadius: spacing(12),
  },
  calendarDayMuted: {
    opacity: 0.34,
  },
  calendarDayDisabled: {
    opacity: 0.44,
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
  calendarDayTextExcluded: {
    color: '#64748b',
  },
  calendarDayTextSelected: {
    color: reactNativeColorScheme.text.inverse,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: spacing(6),
  },
  calendarLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(9),
  },
  calendarMiniLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(8),
    lineHeight: spacing(10),
  },
  calendarMiniLabelSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: radius(5),
    color: moduleColors.accentPressed,
    overflow: 'hidden',
    paddingHorizontal: spacing(3),
  },
  calendarStatusDot: {
    borderRadius: radius(3),
    height: spacing(6),
    width: spacing(6),
  },
  calendarStatusDotSelected: {
    borderColor: reactNativeColorScheme.text.inverse,
    borderWidth: 1,
    height: spacing(7),
    width: spacing(7),
  },
  indicatorRow: {
    flexDirection: 'row',
    gap: spacing(2),
    minHeight: spacing(6),
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
  monthLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(14),
    maxWidth: spacing(62),
    textAlign: 'center',
  },
  monthNav: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(1),
    minHeight: spacing(32),
    paddingHorizontal: spacing(4),
  },
  monthNavButton: {
    alignItems: 'center',
    borderRadius: radius(8),
    height: spacing(28),
    justifyContent: 'center',
    width: spacing(28),
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
    gap: spacing(8),
  },
  panelHeaderCopy: {
    flex: 1,
    gap: spacing(1),
    minWidth: 0,
  },
  panelIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(32),
    justifyContent: 'center',
    width: spacing(32),
  },
  panelLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(18),
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  rangeBridge: {
    backgroundColor: 'rgba(59, 145, 234, 0.2)',
    borderColor: 'rgba(59, 145, 234, 0.26)',
    borderWidth: 1,
    height: spacing(36),
    position: 'absolute',
    top: spacing(8),
    zIndex: 1,
  },
  rangeBridgeEnd: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: radius(18),
    borderTopLeftRadius: 0,
    borderTopRightRadius: radius(18),
    left: 0,
    right: '50%',
  },
  rangeBridgeExcluded: {
    backgroundColor: 'rgba(148, 163, 184, 0.16)',
    borderColor: 'rgba(148, 163, 184, 0.26)',
  },
  rangeBridgeMiddle: {
    left: 0,
    right: 0,
  },
  rangeBridgeSingle: {
    borderRadius: radius(18),
    left: '16%',
    right: '16%',
  },
  rangeBridgeStart: {
    borderBottomLeftRadius: radius(18),
    borderBottomRightRadius: 0,
    borderTopLeftRadius: radius(18),
    borderTopRightRadius: 0,
    left: '50%',
    right: 0,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing(6),
  },
  weekdayText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textAlign: 'center',
    width: '14.285%',
  },
});
