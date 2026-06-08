import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  AttendanceDayDetail,
  AttendancePunchRequest,
  AttendanceSnapshot,
  AttendanceWorkMode,
} from '@/modules/attendance/domain/entities/Attendance';
import { createEmptyAttendanceSnapshot } from '@/modules/attendance/domain/entities/Attendance';
import type { AttendanceHistoryQuery } from '@/modules/attendance/domain/repositories/AttendanceRepository';

import type { RootState } from '../rootReducer';

type AttendanceStatus = 'failed' | 'idle' | 'loading' | 'ready' | 'syncing';
type AttendancePunchStatus = 'failed' | 'idle' | 'loading' | 'ready';
type AttendanceDayStatus = 'failed' | 'idle' | 'loading' | 'ready';

const localDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export type LoadAttendancePayload = AttendanceHistoryQuery;

export interface LoadAttendanceDayPayload {
  date: string;
}

export type RecordAttendancePunchPayload = AttendancePunchRequest;

interface AttendanceState {
  dayDetail: AttendanceDayDetail | null;
  dayErrorMessage: string | null;
  dayStatus: AttendanceDayStatus;
  errorMessage: string | null;
  lastFetchedAt: string | null;
  punchErrorMessage: string | null;
  punchStatus: AttendancePunchStatus;
  selectedDate: string;
  selectedWorkMode: AttendanceWorkMode;
  snapshot: AttendanceSnapshot;
  status: AttendanceStatus;
}

const initialState: AttendanceState = {
  dayDetail: null,
  dayErrorMessage: null,
  dayStatus: 'idle',
  errorMessage: null,
  lastFetchedAt: null,
  punchErrorMessage: null,
  punchStatus: 'idle',
  selectedDate: localDateKey(new Date()),
  selectedWorkMode: 'office',
  snapshot: createEmptyAttendanceSnapshot(),
  status: 'idle',
};

const attendanceSlice = createSlice({
  initialState,
  name: 'attendance',
  reducers: {
    loadAttendanceDayFailed(state, action: PayloadAction<string>) {
      state.dayErrorMessage = action.payload;
      state.dayStatus = 'failed';
    },
    loadAttendanceDayRequested(state, _action: PayloadAction<LoadAttendanceDayPayload>) {
      state.dayErrorMessage = null;
      state.dayStatus = 'loading';
    },
    loadAttendanceDaySucceeded(state, action: PayloadAction<AttendanceDayDetail>) {
      state.dayDetail = action.payload;
      state.dayErrorMessage = null;
      state.dayStatus = 'ready';
    },
    loadAttendanceFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.status = 'failed';
    },
    loadAttendanceHistoryRequested(
      state,
      _action: PayloadAction<LoadAttendancePayload | undefined>,
    ) {
      state.errorMessage = null;
      state.status = 'loading';
    },
    loadAttendanceRequested(
      state,
      _action: PayloadAction<LoadAttendancePayload | undefined>,
    ) {
      state.errorMessage = null;
      state.status = 'loading';
    },
    loadAttendanceSucceeded(state, action: PayloadAction<AttendanceSnapshot>) {
      state.errorMessage = null;
      state.lastFetchedAt = new Date().toISOString();
      state.snapshot = action.payload;
      state.status = 'ready';
    },
    recordAttendancePunchFailed(state, action: PayloadAction<string>) {
      state.punchErrorMessage = action.payload;
      state.punchStatus = 'failed';
    },
    recordAttendancePunchRequested(
      state,
      action: PayloadAction<RecordAttendancePunchPayload>,
    ) {
      state.punchErrorMessage = null;
      state.punchStatus = 'loading';
      state.selectedWorkMode = action.payload.mode;
    },
    recordAttendancePunchSucceeded(state, action: PayloadAction<AttendanceSnapshot>) {
      state.lastFetchedAt = new Date().toISOString();
      state.punchErrorMessage = null;
      state.punchStatus = 'ready';
      state.snapshot = action.payload;
      state.status = 'ready';
    },
    resetAttendance(state) {
      state.dayDetail = null;
      state.dayErrorMessage = null;
      state.dayStatus = 'idle';
      state.errorMessage = null;
      state.lastFetchedAt = null;
      state.punchErrorMessage = null;
      state.punchStatus = 'idle';
      state.selectedDate = localDateKey(new Date());
      state.snapshot = createEmptyAttendanceSnapshot();
      state.status = 'idle';
    },
    setAttendanceSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
    setAttendanceWorkMode(state, action: PayloadAction<AttendanceWorkMode>) {
      state.selectedWorkMode = action.payload;
    },
    syncAttendanceFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.status = 'failed';
    },
    syncAttendanceRequested(state) {
      state.errorMessage = null;
      state.status = 'syncing';
    },
    syncAttendanceSucceeded(state, action: PayloadAction<AttendanceSnapshot>) {
      state.errorMessage = null;
      state.lastFetchedAt = new Date().toISOString();
      state.snapshot = action.payload;
      state.status = 'ready';
    },
  },
});

export const {
  loadAttendanceDayFailed,
  loadAttendanceDayRequested,
  loadAttendanceDaySucceeded,
  loadAttendanceFailed,
  loadAttendanceHistoryRequested,
  loadAttendanceRequested,
  loadAttendanceSucceeded,
  recordAttendancePunchFailed,
  recordAttendancePunchRequested,
  recordAttendancePunchSucceeded,
  resetAttendance,
  setAttendanceSelectedDate,
  setAttendanceWorkMode,
  syncAttendanceFailed,
  syncAttendanceRequested,
  syncAttendanceSucceeded,
} = attendanceSlice.actions;

export const selectAttendanceSnapshot = (state: RootState): AttendanceSnapshot =>
  state.attendance.snapshot;

export const selectAttendanceStatus = (state: RootState): AttendanceStatus =>
  state.attendance.status;

export const selectAttendanceErrorMessage = (state: RootState): string | null =>
  state.attendance.errorMessage;

export const selectAttendanceLastFetchedAt = (state: RootState): string | null =>
  state.attendance.lastFetchedAt;

export const selectAttendancePunchStatus = (
  state: RootState,
): AttendancePunchStatus => state.attendance.punchStatus;

export const selectAttendancePunchErrorMessage = (state: RootState): string | null =>
  state.attendance.punchErrorMessage;

export const selectAttendanceSelectedWorkMode = (
  state: RootState,
): AttendanceWorkMode => state.attendance.selectedWorkMode;

export const selectAttendanceSelectedDate = (state: RootState): string =>
  state.attendance.selectedDate;

export const selectAttendanceDayDetail = (state: RootState): AttendanceDayDetail | null =>
  state.attendance.dayDetail;

export const selectAttendanceDayStatus = (
  state: RootState,
): AttendanceDayStatus => state.attendance.dayStatus;

export const selectAttendanceDayErrorMessage = (state: RootState): string | null =>
  state.attendance.dayErrorMessage;

export const attendanceReducer = attendanceSlice.reducer;
