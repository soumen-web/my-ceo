import { useCallback, useEffect, useMemo } from 'react';

import type {
  AttendancePunchRequest,
  AttendanceWorkMode,
} from '@/modules/attendance/domain/entities/Attendance';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadAttendanceDayRequested,
  loadAttendanceHistoryRequested,
  loadAttendanceRequested,
  recordAttendancePunchRequested,
  selectAttendanceDayDetail,
  selectAttendanceDayErrorMessage,
  selectAttendanceDayStatus,
  selectAttendanceErrorMessage,
  selectAttendanceLastFetchedAt,
  selectAttendancePunchErrorMessage,
  selectAttendancePunchStatus,
  selectAttendanceSelectedDate,
  selectAttendanceSelectedWorkMode,
  selectAttendanceSnapshot,
  selectAttendanceStatus,
  setAttendanceSelectedDate,
  setAttendanceWorkMode,
  syncAttendanceRequested,
} from '@/store/slices/attendanceSlice';

const minutesToDuration = (minutes: number): string => {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

const localDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const nowDateKey = (): string => localDateKey(new Date());

const dateLabelFromKey = (dateKey: string): string => {
  const date = new Date(`${dateKey}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return 'Selected day';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    weekday: 'short',
    year: 'numeric',
  }).format(date);
};

const shiftDate = (dateKey: string, dayOffset: number): string => {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + dayOffset);

  return localDateKey(date);
};

export const useAttendanceScreenModel = () => {
  const dispatch = useAppDispatch();
  const dayDetail = useAppSelector(selectAttendanceDayDetail);
  const dayErrorMessage = useAppSelector(selectAttendanceDayErrorMessage);
  const dayStatus = useAppSelector(selectAttendanceDayStatus);
  const errorMessage = useAppSelector(selectAttendanceErrorMessage);
  const lastFetchedAt = useAppSelector(selectAttendanceLastFetchedAt);
  const punchErrorMessage = useAppSelector(selectAttendancePunchErrorMessage);
  const punchStatus = useAppSelector(selectAttendancePunchStatus);
  const selectedDate = useAppSelector(selectAttendanceSelectedDate);
  const selectedWorkMode = useAppSelector(selectAttendanceSelectedWorkMode);
  const snapshot = useAppSelector(selectAttendanceSnapshot);
  const status = useAppSelector(selectAttendanceStatus);

  const refresh = useCallback(() => {
    dispatch(loadAttendanceRequested(undefined));
  }, [dispatch]);

  const refreshHistory = useCallback(() => {
    dispatch(loadAttendanceHistoryRequested(undefined));
  }, [dispatch]);

  const sync = useCallback(() => {
    dispatch(syncAttendanceRequested());
  }, [dispatch]);

  const setWorkMode = useCallback(
    (mode: AttendanceWorkMode) => {
      dispatch(setAttendanceWorkMode(mode));
    },
    [dispatch],
  );

  const recordPunch = useCallback(
    (request: Omit<AttendancePunchRequest, 'mode'>) => {
      dispatch(
        recordAttendancePunchRequested({
          ...request,
          mode: selectedWorkMode,
        }),
      );
    },
    [dispatch, selectedWorkMode],
  );

  const loadDay = useCallback(
    (date = nowDateKey()) => {
      dispatch(setAttendanceSelectedDate(date));
      dispatch(loadAttendanceDayRequested({ date }));
    },
    [dispatch],
  );

  const selectDate = useCallback(
    (date: string) => {
      dispatch(setAttendanceSelectedDate(date));
      dispatch(loadAttendanceDayRequested({ date }));
    },
    [dispatch],
  );

  const selectPreviousDay = useCallback(() => {
    selectDate(shiftDate(selectedDate, -1));
  }, [selectDate, selectedDate]);

  const selectNextDay = useCallback(() => {
    selectDate(shiftDate(selectedDate, 1));
  }, [selectDate, selectedDate]);

  const jumpToToday = useCallback(() => {
    selectDate(nowDateKey());
  }, [selectDate]);

  useEffect(() => {
    if (status === 'idle') {
      refresh();
    }
  }, [refresh, status]);

  useEffect(() => {
    if (!dayDetail && dayStatus === 'idle') {
      loadDay(selectedDate);
    }
  }, [dayDetail, dayStatus, loadDay, selectedDate]);

  const derived = useMemo(() => {
    const { month, today } = snapshot;
    const varianceMinutes = today.lateByMinutes || today.earlyByMinutes;
    const varianceLabel = today.lateByMinutes
      ? `${today.lateByMinutes}m late`
      : today.earlyByMinutes
        ? `${today.earlyByMinutes}m early`
        : 'On schedule';
    const punchActionLabel = today.isClockedIn ? 'Clock out' : 'Clock in';
    const punchActionType = today.isClockedIn ? 'clock-out' : 'clock-in';

    return {
      attendanceRateLabel: `${Math.round(month.attendanceRate)}%`,
      isInitialLoading:
        status === 'loading' &&
        !errorMessage &&
        !snapshot.history.length &&
        !snapshot.recentPunches.length,
      isRefreshing: status === 'loading' || status === 'syncing',
      isSelectedToday: selectedDate === nowDateKey(),
      punchActionLabel,
      punchActionType: punchActionType as AttendancePunchRequest['type'],
      readinessLabel: `${Math.round(month.readinessScore)}%`,
      selectedDateLabel: dateLabelFromKey(selectedDate),
      varianceLabel,
      varianceMinutes,
      workDurationLabel: minutesToDuration(today.workDurationMinutes),
      workHoursLabel: `${Math.round(month.workHours)}h`,
    };
  }, [errorMessage, selectedDate, snapshot, status]);

  return {
    ...derived,
    dayDetail,
    dayErrorMessage,
    dayStatus,
    errorMessage,
    lastFetchedAt,
    jumpToToday,
    loadDay,
    punchErrorMessage,
    punchStatus,
    recordPunch,
    refresh,
    refreshHistory,
    selectDate,
    selectedDate,
    selectedWorkMode,
    selectNextDay,
    selectPreviousDay,
    setWorkMode,
    snapshot,
    status,
    sync,
  };
};

export { minutesToDuration };
