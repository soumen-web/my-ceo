import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppFonts } from '@/assets/fonts';
import { EnterpriseFeedbackBanner } from '@/design-system/components';
import { reactNativeColorScheme } from '@/design-system/tokens/colors';
import type {
  LeaveCalendarDay,
  LeaveDayPart,
  LeaveDayType,
  LeaveType,
} from '@/modules/leave/domain/entities/Leave';
import { leaveTypeLabel } from '@/modules/leave/domain/entities/Leave';
import {
  addLeaveDays,
  getLeaveDateKey,
  getLeaveDateRangeSummary,
  getLeaveDateTime,
} from '@/modules/leave/domain/services/leaveDateRange';
import type { LeaveStackParamList } from '@/navigation/route-types';
import { fontSize, radius, spacing } from '@/utils/scale';

import {
  formatLeaveDateLong,
  getMonthDateFromSelectedDate,
  LeaveDateRangeCalendar,
  LeaveScreenFrame,
  LeaveTypeSelector,
} from '../components';
import { useLeaveScreenModel } from '../hooks/useLeaveScreenModel';

type ApplyLeaveScreenProps = NativeStackScreenProps<LeaveStackParamList, 'LeaveApply'>;
type ActiveDateField = 'end' | 'start';

type SelectedRangeDateDetail = {
  date: string;
  dayName: string;
  displayDate: string;
  isEndDate: boolean;
  isStartDate: boolean;
  dayType: LeaveDayType;
  durationLabel: 'First Half' | 'Full Day' | 'Second Half';
  value: 0.5 | 1;
};

const moduleColors = reactNativeColorScheme.ultiHuman.module;
const visibleRangeDetailCount = 4;

const dayTypeMeta: Record<
  LeaveDayType,
  Pick<SelectedRangeDateDetail, 'durationLabel' | 'value'> & { dayPart: LeaveDayPart }
> = {
  FIRST_HALF: {
    dayPart: 'first-half',
    durationLabel: 'First Half',
    value: 0.5,
  },
  FULL_DAY: {
    dayPart: 'full-day',
    durationLabel: 'Full Day',
    value: 1,
  },
  SECOND_HALF: {
    dayPart: 'second-half',
    durationLabel: 'Second Half',
    value: 0.5,
  },
};

const isBlockingRequestStatus = (status: string): boolean =>
  status !== 'cancelled' && status !== 'rejected';

const getAllowedDayTypes = (
  detail: Pick<SelectedRangeDateDetail, 'isEndDate' | 'isStartDate'>,
): LeaveDayType[] => {
  if (detail.isStartDate && detail.isEndDate) {
    return ['FULL_DAY', 'FIRST_HALF', 'SECOND_HALF'];
  }

  if (detail.isStartDate) {
    return ['FULL_DAY', 'SECOND_HALF'];
  }

  if (detail.isEndDate) {
    return ['FULL_DAY', 'FIRST_HALF'];
  }

  return ['FULL_DAY'];
};

const getSelectedRangeDateDetails = (
  dates: string[],
  dayTypeByDate: Partial<Record<string, LeaveDayType>>,
): SelectedRangeDateDetail[] => {
  const lastIndex = dates.length - 1;

  return dates.map((date, index) => {
    const dateValue = new Date(`${date}T12:00:00`);
    const position = {
      isEndDate: index === lastIndex,
      isStartDate: index === 0,
    };
    const allowedDayTypes = getAllowedDayTypes(position);
    const requestedDayType = dayTypeByDate[date] ?? 'FULL_DAY';
    const dayType = allowedDayTypes.includes(requestedDayType) ? requestedDayType : 'FULL_DAY';
    const durationMeta = dayTypeMeta[dayType];

    return {
      date,
      dayType,
      dayName: new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(dateValue),
      displayDate: new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
      }).format(dateValue),
      ...position,
      ...durationMeta,
    };
  });
};

export const ApplyLeaveScreen = ({ navigation, route }: ApplyLeaveScreenProps) => {
  const {
    applyErrorMessage,
    applyLeave,
    applyStatus,
    resetApplyState,
    snapshot,
  } = useLeaveScreenModel();
  const tomorrow = addLeaveDays(getLeaveDateKey(new Date()), 1);
  const [type, setType] = useState<LeaveType>('casual');
  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(tomorrow);
  const [reason, setReason] = useState('');
  const [activeDateField, setActiveDateField] = useState<ActiveDateField | null>(null);
  const [dayTypeByDate, setDayTypeByDate] = useState<Partial<Record<string, LeaveDayType>>>({});
  const [isRangeExpanded, setIsRangeExpanded] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(() => getMonthDateFromSelectedDate(tomorrow));
  const calendarByDate = useMemo(
    () => new Map(snapshot.calendar.map((day) => [day.date, day])),
    [snapshot.calendar],
  );
  const isBookedDate = useCallback(
    (date: string) =>
      calendarByDate
        .get(date)
        ?.requests.some((request) => isBlockingRequestStatus(request.status)) ?? false,
    [calendarByDate],
  );
  const isDateDisabled = useCallback(
    (date: string) => getLeaveDateTime(date) < getLeaveDateTime(tomorrow) || isBookedDate(date),
    [isBookedDate, tomorrow],
  );
  const rangeSummary = useMemo(
    () => getLeaveDateRangeSummary(startDate, endDate, 'full-day'),
    [endDate, startDate],
  );
  const hasDateConflict = useMemo(
    () => rangeSummary.rangeDates.some((date) => isBookedDate(date)),
    [isBookedDate, rangeSummary.rangeDates],
  );
  const selectedRangeDateDetails = useMemo(
    () => getSelectedRangeDateDetails(rangeSummary.countedDates, dayTypeByDate),
    [dayTypeByDate, rangeSummary.countedDates],
  );
  const requestedDays = selectedRangeDateDetails.reduce((total, detail) => total + detail.value, 0);
  const balance = snapshot.balances.find((item) => item.type === type);
  const isValid =
    reason.trim().length >= 8 &&
    requestedDays > 0 &&
    getLeaveDateTime(endDate) >= getLeaveDateTime(startDate) &&
    !hasDateConflict &&
    (!balance || balance.available >= requestedDays || type === 'unpaid');

  useEffect(() => {
    setIsRangeExpanded(false);
    setDayTypeByDate({});
  }, [endDate, startDate]);

  const openDatePicker = (field: ActiveDateField) => {
    Keyboard.dismiss();
    setActiveDateField(field);
    setPickerMonth(getMonthDateFromSelectedDate(field === 'start' ? startDate : endDate));
  };

  const closeDatePicker = () => {
    setActiveDateField(null);
  };

  const changePickerMonth = (offset: number) => {
    setPickerMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1, 12),
    );
  };

  const selectDate = (date: string) => {
    if (!activeDateField || isDateDisabled(date)) {
      return;
    }

    if (activeDateField === 'start') {
      setStartDate(date);
      if (getLeaveDateTime(endDate) < getLeaveDateTime(date)) {
        setEndDate(date);
      }
      setActiveDateField('end');
    } else {
      if (getLeaveDateTime(date) < getLeaveDateTime(startDate)) {
        setStartDate(date);
        setEndDate(date);
      } else {
        setEndDate(date);
      }
      setActiveDateField('end');
    }

    resetApplyState();
  };

  const handleRangeDayTypeChange = (date: string, value: LeaveDayType) => {
    setDayTypeByDate((current) => ({
      ...current,
      [date]: value,
    }));

    resetApplyState();
  };

  const submit = () => {
    if (!isValid) {
      return;
    }

    const legacyDayPart =
      selectedRangeDateDetails.length === 1
        ? dayTypeMeta[selectedRangeDateDetails[0]?.dayType ?? 'FULL_DAY'].dayPart
        : 'full-day';

    applyLeave({
      dayPart: legacyDayPart,
      endDate,
      reason: reason.trim(),
      selectedDates: selectedRangeDateDetails.map((detail) => ({
        date: detail.date,
        dayType: detail.dayType,
        value: detail.value,
      })),
      startDate,
      startDateType: selectedRangeDateDetails[0]?.dayType,
      endDateType: selectedRangeDateDetails[selectedRangeDateDetails.length - 1]?.dayType,
      totalDays: requestedDays,
      type,
    });
  };

  return (
    <LeaveScreenFrame
      isDetail
      keyboardAware
      navigation={navigation}
      returnToDashboard={route.params?.returnToDashboard}
      title="Apply leave"
    >
      {applyErrorMessage ? (
        <EnterpriseFeedbackBanner message={applyErrorMessage} tone="error" />
      ) : null}
      {applyStatus === 'ready' ? (
        <EnterpriseFeedbackBanner
          message="Leave request submitted and moved to manager approval."
          tone="empty"
        />
      ) : null}

      <View style={styles.panel}>
        <Text style={styles.label}>Leave type</Text>
        <LeaveTypeSelector onChange={setType} value={type} />
      </View>

      <View style={styles.panel}>
        <Text style={styles.label}>Dates</Text>
        <View style={styles.dateFieldGrid}>
          <DateField label="Start date" onPress={() => openDatePicker('start')} value={startDate} />
          <DateField
            label="End date"
            onPress={() => openDatePicker('end')}
            value={endDate}
          />
        </View>
        {hasDateConflict ? (
          <InlineHint
            icon="alert-triangle"
            text="Selected range overlaps an existing leave request."
            tone="warning"
          />
        ) : (
          <InlineHint
            icon="shield"
            text="Booked dates are protected. Holidays stay highlighted in the picker."
            tone="success"
          />
        )}
      </View>

      <LeaveRangeSummaryPanel
        actualLeaveDays={requestedDays}
        dateDetails={selectedRangeDateDetails}
        endDate={endDate}
        excludedSundays={rangeSummary.excludedDates.length}
        isExpanded={isRangeExpanded}
        onDayTypeChange={handleRangeDayTypeChange}
        onToggleExpanded={() => setIsRangeExpanded((current) => !current)}
        startDate={startDate}
        totalCalendarDays={rangeSummary.totalCalendarDays}
      />

      <View style={styles.panel}>
        <Text style={styles.label}>Reason</Text>
        <TextInput
          multiline
          onChangeText={(value) => {
            setReason(value);
            resetApplyState();
          }}
          placeholder="Add context for your manager"
          placeholderTextColor={reactNativeColorScheme.text.disabled}
          style={styles.input}
          value={reason}
        />
      </View>

      <View style={styles.preview}>
        <View style={styles.previewCopy}>
          <Text style={styles.previewLabel}>Request preview</Text>
          <Text style={styles.previewTitle}>
            {leaveTypeLabel[type]} - {requestedDays} day{requestedDays === 1 ? '' : 's'}
          </Text>
          <Text style={styles.previewMeta}>
            {formatLeaveDateLong(startDate)} to {formatLeaveDateLong(endDate)}
          </Text>
          <Text style={styles.previewMeta}>
            Balance after request: {Math.max(0, (balance?.available ?? 0) - requestedDays).toFixed(1)}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={!isValid || applyStatus === 'loading'}
          onPress={submit}
          style={({ pressed }) => [
            styles.submitButton,
            (!isValid || applyStatus === 'loading') && styles.submitButtonDisabled,
            pressed && styles.pressed,
          ]}
        >
          <Feather color={moduleColors.selectedText} name="send" size={spacing(16)} />
          <Text style={styles.submitText}>
            {applyStatus === 'loading' ? 'Submitting' : 'Submit'}
          </Text>
        </Pressable>
      </View>

      <LeaveDatePickerSheet
        activeField={activeDateField}
        calendar={snapshot.calendar}
        endDate={endDate}
        isDateDisabled={isDateDisabled}
        month={pickerMonth}
        onChangeMonth={changePickerMonth}
        onClose={closeDatePicker}
        onSelectDate={selectDate}
        onSetActiveField={setActiveDateField}
        startDate={startDate}
      />
    </LeaveScreenFrame>
  );
};

const DateField = ({
  disabled = false,
  label,
  onPress,
  value,
}: {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  value: string;
}) => (
  <Pressable
    accessibilityRole="button"
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      styles.dateField,
      disabled && styles.dateFieldDisabled,
      pressed && styles.pressed,
    ]}
  >
    <View style={styles.dateFieldIcon}>
      <Feather color={moduleColors.icon} name="calendar" size={spacing(15)} />
    </View>
    <View style={styles.dateFieldCopy}>
      <Text style={styles.dateLabel}>{label}</Text>
      <Text numberOfLines={1} style={styles.dateValue}>{formatLeaveDateLong(value)}</Text>
    </View>
    <Feather color={moduleColors.icon} name="chevron-up" size={spacing(15)} />
  </Pressable>
);

const LeaveRangeSummaryPanel = ({
  actualLeaveDays,
  dateDetails,
  endDate,
  excludedSundays,
  isExpanded,
  onDayTypeChange,
  onToggleExpanded,
  startDate,
  totalCalendarDays,
}: {
  actualLeaveDays: number;
  dateDetails: SelectedRangeDateDetail[];
  endDate: string;
  excludedSundays: number;
  isExpanded: boolean;
  onDayTypeChange: (date: string, value: LeaveDayType) => void;
  onToggleExpanded: () => void;
  startDate: string;
  totalCalendarDays: number;
}) => {
  const hasOverflow = dateDetails.length > visibleRangeDetailCount;
  const visibleDetails = isExpanded ? dateDetails : dateDetails.slice(0, visibleRangeDetailCount);
  const [activeDurationDate, setActiveDurationDate] = useState<string | null>(null);

  useEffect(() => {
    if (activeDurationDate && !visibleDetails.some((detail) => detail.date === activeDurationDate)) {
      setActiveDurationDate(null);
    }
  }, [activeDurationDate, visibleDetails]);

  return (
    <View style={styles.summaryPanel}>
      <View style={styles.summaryHeader}>
        <View style={styles.summaryIcon}>
          <Feather color={moduleColors.icon} name="calendar" size={spacing(16)} />
        </View>
        <View style={styles.summaryCopy}>
          <Text style={styles.previewLabel}>Selected range</Text>
          <Text numberOfLines={1} style={styles.summaryTitle}>
            {formatLeaveDateLong(startDate)} - {formatLeaveDateLong(endDate)}
          </Text>
        </View>
      </View>
      <View style={styles.summaryGrid}>
        <SummaryMetric label="Calendar days" value={totalCalendarDays.toString()} />
        <SummaryMetric label="Sundays excluded" value={excludedSundays.toString()} />
        <SummaryMetric label="Leave count" value={actualLeaveDays.toString()} />
      </View>

      <View style={styles.rangeDetailList}>
        {visibleDetails.length ? (
          visibleDetails.map((detail) => (
            <SelectedRangeDateRow
              active={activeDurationDate === detail.date}
              detail={detail}
              key={detail.date}
              onSelectDayType={(date, value) => {
                onDayTypeChange(date, value);
                setActiveDurationDate(null);
              }}
              onToggleOptions={() => {
                setActiveDurationDate((current) => (current === detail.date ? null : detail.date));
              }}
            />
          ))
        ) : (
          <View style={styles.rangeEmptyRow}>
            <Feather color={moduleColors.icon} name="info" size={spacing(14)} />
            <Text style={styles.rangeEmptyText}>
              No payable leave days in this range.
            </Text>
          </View>
        )}
      </View>

      {hasOverflow ? (
        <Pressable
          accessibilityRole="button"
          onPress={onToggleExpanded}
          style={({ pressed }) => [styles.rangeToggle, pressed && styles.pressed]}
        >
          <Text style={styles.rangeToggleText}>
            {isExpanded ? 'Show fewer dates' : `View all ${dateDetails.length} dates`}
          </Text>
          <Feather
            color={moduleColors.icon}
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={spacing(15)}
          />
        </Pressable>
      ) : null}
    </View>
  );
};

const SelectedRangeDateRow = ({
  active,
  detail,
  onSelectDayType,
  onToggleOptions,
}: {
  active: boolean;
  detail: SelectedRangeDateDetail;
  onSelectDayType: (date: string, value: LeaveDayType) => void;
  onToggleOptions: () => void;
}) => {
  const allowedDayTypes = getAllowedDayTypes(detail);
  const canChangeDuration = allowedDayTypes.length > 1;

  return (
    <View style={styles.rangeDateItem}>
      <View style={styles.rangeDateRow}>
        <View style={styles.rangeDateBadge}>
          <Text numberOfLines={1} style={styles.rangeDateValue}>
            {detail.displayDate}
          </Text>
        </View>
        <View style={styles.rangeDateCopy}>
          <Text numberOfLines={1} style={styles.rangeDayName}>
            {detail.dayName}
          </Text>
          <Text style={styles.rangeDateMeta}>{detail.date}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={!canChangeDuration}
          onPress={onToggleOptions}
          style={({ pressed }) => [
            styles.durationSelectedButton,
            !canChangeDuration && styles.durationSelectedButtonDisabled,
            pressed && styles.pressed,
          ]}
        >
          <Text numberOfLines={1} style={styles.durationSelectedText}>
            {detail.durationLabel}
          </Text>
          <Feather
            color={moduleColors.selectedText}
            name={canChangeDuration ? (active ? 'chevron-up' : 'chevron-down') : 'lock'}
            size={spacing(12)}
          />
        </Pressable>
        <Text style={styles.rangeValueText}>
          {detail.value} day
        </Text>
      </View>

      {active ? (
        <View style={styles.durationOptionRow}>
          {allowedDayTypes.map((dayType) => {
            const isSelected = detail.dayType === dayType;

            return (
              <Pressable
                accessibilityRole="button"
                key={dayType}
                onPress={() => onSelectDayType(detail.date, dayType)}
                style={({ pressed }) => [
                  styles.durationOptionChip,
                  isSelected && styles.durationOptionChipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.durationOptionText,
                    isSelected && styles.durationOptionTextSelected,
                  ]}
                >
                  {dayTypeMeta[dayType].durationLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

const SummaryMetric = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.summaryMetric}>
    <Text style={styles.summaryMetricValue}>{value}</Text>
    <Text numberOfLines={1} style={styles.summaryMetricLabel}>{label}</Text>
  </View>
);

const InlineHint = ({
  icon,
  text,
  tone,
}: {
  icon: keyof typeof Feather.glyphMap;
  text: string;
  tone: 'success' | 'warning';
}) => (
  <View style={[styles.inlineHint, tone === 'warning' && styles.inlineHintWarning]}>
    <Feather color={tone === 'warning' ? '#b45309' : moduleColors.icon} name={icon} size={spacing(14)} />
    <Text style={[styles.inlineHintText, tone === 'warning' && styles.inlineHintTextWarning]}>
      {text}
    </Text>
  </View>
);

const LeaveDatePickerSheet = ({
  activeField,
  calendar,
  endDate,
  isDateDisabled,
  month,
  onChangeMonth,
  onClose,
  onSelectDate,
  onSetActiveField,
  startDate,
}: {
  activeField: ActiveDateField | null;
  calendar: LeaveCalendarDay[];
  endDate: string;
  isDateDisabled: (date: string) => boolean;
  month: Date;
  onChangeMonth: (offset: number) => void;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  onSetActiveField: (field: ActiveDateField) => void;
  startDate: string;
}) => {
  const selectedDate = activeField === 'end' ? endDate : startDate;

  return (
    <Modal animationType="none" onRequestClose={onClose} transparent visible={Boolean(activeField)}>
      <View style={styles.modalRoot}>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.modalOverlay} />
        <View style={styles.dateSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.previewLabel}>Leave dates</Text>
              <Text style={styles.sheetTitle}>
                Pick {activeField === 'end' ? 'end' : 'start'} date
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <Feather color={moduleColors.icon} name="x" size={spacing(16)} />
            </Pressable>
          </View>

          <View style={styles.sheetToggle}>
            <DateModeButton
              active={activeField === 'start'}
              label="Start"
              onPress={() => onSetActiveField('start')}
              value={formatLeaveDateLong(startDate)}
            />
            <DateModeButton
              active={activeField === 'end'}
              label="End"
              onPress={() => onSetActiveField('end')}
              value={formatLeaveDateLong(endDate)}
            />
          </View>

          <LeaveDateRangeCalendar
            calendar={calendar}
            endDate={endDate}
            isDateDisabled={isDateDisabled}
            month={month}
            onChangeMonth={onChangeMonth}
            onSelectDate={onSelectDate}
            selectedDate={selectedDate}
            startDate={startDate}
          />

          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.sheetDoneButton, pressed && styles.pressed]}
          >
            <Text style={styles.sheetDoneText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const DateModeButton = ({
  active,
  label,
  onPress,
  value,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
  value: string;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [
      styles.dateModeButton,
      active && styles.dateModeButtonActive,
      pressed && styles.pressed,
    ]}
  >
    <Text style={[styles.dateModeLabel, active && styles.dateModeLabelActive]}>{label}</Text>
    <Text numberOfLines={1} style={[styles.dateModeValue, active && styles.dateModeValueActive]}>
      {value}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(34),
    justifyContent: 'center',
    width: spacing(34),
  },
  dateField: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing(9),
    minHeight: spacing(62),
    minWidth: 0,
    paddingHorizontal: spacing(11),
  },
  dateFieldCopy: {
    flex: 1,
    gap: spacing(3),
    minWidth: 0,
  },
  dateFieldDisabled: {
    opacity: 0.54,
  },
  dateFieldGrid: {
    flexDirection: 'row',
    gap: spacing(9),
  },
  dateFieldIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(34),
    justifyContent: 'center',
    width: spacing(34),
  },
  dateLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  dateModeButton: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
    paddingHorizontal: spacing(12),
    paddingVertical: spacing(9),
  },
  dateModeButtonActive: {
    backgroundColor: moduleColors.selected,
    borderColor: moduleColors.accent,
  },
  dateModeLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
    textTransform: 'uppercase',
  },
  dateModeLabelActive: {
    color: moduleColors.selectedText,
  },
  dateModeValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  dateModeValueActive: {
    color: moduleColors.selectedText,
  },
  dateSheet: {
    backgroundColor: reactNativeColorScheme.ultiHuman.background,
    borderColor: moduleColors.borderStrong,
    borderTopLeftRadius: radius(8),
    borderTopRightRadius: radius(8),
    borderWidth: 1,
    bottom: 0,
    gap: spacing(12),
    left: 0,
    maxHeight: '88%',
    padding: spacing(16),
    position: 'absolute',
    right: 0,
    shadowColor: moduleColors.shadow,
    shadowOffset: { height: -spacing(10), width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: spacing(22),
  },
  dateValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  inlineHint: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(8),
    minHeight: spacing(38),
    paddingHorizontal: spacing(12),
  },
  inlineHintText: {
    color: reactNativeColorScheme.text.secondary,
    flex: 1,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  inlineHintTextWarning: {
    color: '#92400e',
  },
  inlineHintWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.34)',
  },
  input: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(13),
    lineHeight: spacing(19),
    minHeight: spacing(104),
    padding: spacing(12),
    textAlignVertical: 'top',
  },
  label: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(15),
    lineHeight: spacing(20),
  },
  panel: {
    gap: spacing(10),
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  durationSelectedButton: {
    alignItems: 'center',
    backgroundColor: moduleColors.selected,
    borderColor: moduleColors.accent,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(5),
    justifyContent: 'center',
    minHeight: spacing(30),
    paddingHorizontal: spacing(9),
    width: spacing(94),
  },
  durationSelectedButtonDisabled: {
    opacity: 0.82,
  },
  durationSelectedText: {
    color: moduleColors.selectedText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    flex: 1,
    lineHeight: spacing(13),
  },
  durationOptionChip: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: spacing(30),
    paddingHorizontal: spacing(10),
  },
  durationOptionChipSelected: {
    backgroundColor: moduleColors.selected,
    borderColor: moduleColors.accent,
  },
  durationOptionRow: {
    borderTopColor: moduleColors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(6),
    paddingBottom: spacing(9),
    paddingHorizontal: spacing(9),
    paddingTop: spacing(8),
  },
  durationOptionText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
  },
  durationOptionTextSelected: {
    color: moduleColors.selectedText,
  },
  preview: {
    alignItems: 'center',
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(12),
    justifyContent: 'space-between',
    padding: spacing(14),
  },
  previewCopy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  previewLabel: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    textTransform: 'uppercase',
  },
  previewMeta: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(12),
    lineHeight: spacing(17),
  },
  previewTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
  sheetHandle: {
    alignSelf: 'center',
    backgroundColor: moduleColors.borderStrong,
    borderRadius: radius(8),
    height: spacing(4),
    opacity: 0.8,
    width: spacing(42),
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(18),
    lineHeight: spacing(24),
  },
  sheetDoneButton: {
    alignItems: 'center',
    backgroundColor: moduleColors.selected,
    borderRadius: radius(8),
    justifyContent: 'center',
    minHeight: spacing(44),
  },
  sheetDoneText: {
    color: moduleColors.selectedText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(13),
    lineHeight: spacing(18),
  },
  sheetToggle: {
    flexDirection: 'row',
    gap: spacing(9),
  },
  rangeDateBadge: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: spacing(36),
    paddingHorizontal: spacing(9),
    width: spacing(72),
  },
  rangeDateCopy: {
    flex: 1,
    gap: spacing(1),
    minWidth: 0,
  },
  rangeDateMeta: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansRegular,
    fontSize: fontSize(10),
    lineHeight: spacing(13),
  },
  rangeDateRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(8),
    minHeight: spacing(50),
    paddingHorizontal: spacing(9),
    paddingVertical: spacing(8),
  },
  rangeDateItem: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    overflow: 'hidden',
  },
  rangeDateValue: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  rangeDayName: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  rangeDetailList: {
    gap: spacing(7),
  },
  rangeEmptyRow: {
    alignItems: 'center',
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing(8),
    minHeight: spacing(42),
    paddingHorizontal: spacing(11),
  },
  rangeEmptyText: {
    color: reactNativeColorScheme.text.secondary,
    flex: 1,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  rangeToggle: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: spacing(5),
    minHeight: spacing(32),
    paddingHorizontal: spacing(2),
  },
  rangeToggleText: {
    color: moduleColors.accentPressed,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
  },
  rangeValueText: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(11),
    lineHeight: spacing(15),
    minWidth: spacing(42),
    textAlign: 'right',
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: moduleColors.selected,
    borderRadius: radius(8),
    flexDirection: 'row',
    gap: spacing(7),
    minHeight: spacing(42),
    paddingHorizontal: spacing(13),
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitText: {
    color: moduleColors.selectedText,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(12),
    lineHeight: spacing(16),
  },
  summaryCopy: {
    flex: 1,
    gap: spacing(2),
    minWidth: 0,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing(8),
  },
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing(10),
  },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: moduleColors.iconSurface,
    borderRadius: radius(8),
    height: spacing(38),
    justifyContent: 'center',
    width: spacing(38),
  },
  summaryMetric: {
    backgroundColor: moduleColors.heroMetric,
    borderColor: moduleColors.border,
    borderRadius: radius(8),
    borderWidth: 1,
    flex: 1,
    gap: spacing(1),
    minWidth: 0,
    paddingHorizontal: spacing(9),
    paddingVertical: spacing(9),
  },
  summaryMetricLabel: {
    color: reactNativeColorScheme.text.secondary,
    fontFamily: AppFonts.googleSansMedium,
    fontSize: fontSize(9),
    lineHeight: spacing(12),
  },
  summaryMetricValue: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(17),
    lineHeight: spacing(22),
  },
  summaryPanel: {
    backgroundColor: reactNativeColorScheme.ultiHuman.surface.glassPanel,
    borderColor: reactNativeColorScheme.ultiHuman.surface.aquaBorderMuted,
    borderRadius: radius(8),
    borderWidth: 1,
    gap: spacing(12),
    padding: spacing(14),
  },
  summaryTitle: {
    color: reactNativeColorScheme.ultiHuman.text,
    fontFamily: AppFonts.googleSansBold,
    fontSize: fontSize(14),
    lineHeight: spacing(19),
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 28, 46, 0.32)',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
