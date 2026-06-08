import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';

import { attendanceUseCases } from '@/modules/attendance';
import type {
  AttendanceDayDetail,
  AttendanceSnapshot,
} from '@/modules/attendance/domain/entities/Attendance';
import { logger } from '@/services/observability/logger/logger';
import { toAppError } from '@/shared/core/errors/AppError';

import {
  loadAttendanceDayFailed,
  loadAttendanceDayRequested,
  loadAttendanceDaySucceeded,
  loadAttendanceFailed,
  loadAttendanceHistoryRequested,
  loadAttendanceRequested,
  loadAttendanceSucceeded,
  type LoadAttendanceDayPayload,
  type LoadAttendancePayload,
  recordAttendancePunchFailed,
  recordAttendancePunchRequested,
  recordAttendancePunchSucceeded,
  type RecordAttendancePunchPayload,
  syncAttendanceFailed,
  syncAttendanceRequested,
  syncAttendanceSucceeded,
} from '../slices/attendanceSlice';

function* handleLoadAttendance(
  action: PayloadAction<LoadAttendancePayload | undefined>,
) {
  try {
    const snapshot: AttendanceSnapshot = yield call([
      attendanceUseCases.getHistory,
      attendanceUseCases.getHistory.execute,
    ], action.payload);

    yield put(loadAttendanceSucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load attendance overview.', {
      code: appError.code,
      details: appError.details,
      scope: 'attendanceSaga',
    });
    yield put(loadAttendanceFailed(appError.userMessage));
  }
}

function* handleLoadAttendanceHistory(
  action: PayloadAction<LoadAttendancePayload | undefined>,
) {
  try {
    const snapshot: AttendanceSnapshot = yield call([
      attendanceUseCases.getSnapshot,
      attendanceUseCases.getSnapshot.execute,
    ], action.payload);

    yield put(loadAttendanceSucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load attendance history.', {
      code: appError.code,
      details: appError.details,
      scope: 'attendanceSaga',
    });
    yield put(loadAttendanceFailed(appError.userMessage));
  }
}

function* handleLoadAttendanceDay(action: PayloadAction<LoadAttendanceDayPayload>) {
  try {
    const detail: AttendanceDayDetail = yield call([
      attendanceUseCases.getDay,
      attendanceUseCases.getDay.execute,
    ], action.payload.date);

    yield put(loadAttendanceDaySucceeded(detail));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load attendance day.', {
      code: appError.code,
      details: appError.details,
      scope: 'attendanceSaga',
    });
    yield put(loadAttendanceDayFailed(appError.userMessage));
  }
}

function* handleRecordAttendancePunch(
  action: PayloadAction<RecordAttendancePunchPayload>,
) {
  try {
    const snapshot: AttendanceSnapshot = yield call([
      attendanceUseCases.recordPunch,
      attendanceUseCases.recordPunch.execute,
    ], action.payload);

    yield put(recordAttendancePunchSucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to record attendance punch.', {
      code: appError.code,
      details: appError.details,
      scope: 'attendanceSaga',
    });
    yield put(recordAttendancePunchFailed(appError.userMessage));
  }
}

function* handleSyncAttendance() {
  try {
    const snapshot: AttendanceSnapshot = yield call([
      attendanceUseCases.sync,
      attendanceUseCases.sync.execute,
    ]);

    yield put(syncAttendanceSucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to sync attendance.', {
      code: appError.code,
      details: appError.details,
      scope: 'attendanceSaga',
    });
    yield put(syncAttendanceFailed(appError.userMessage));
  }
}

export function* attendanceSaga() {
  yield takeLatest(loadAttendanceRequested.type, handleLoadAttendance);
  yield takeLatest(loadAttendanceHistoryRequested.type, handleLoadAttendanceHistory);
  yield takeLatest(loadAttendanceDayRequested.type, handleLoadAttendanceDay);
  yield takeLatest(recordAttendancePunchRequested.type, handleRecordAttendancePunch);
  yield takeLatest(syncAttendanceRequested.type, handleSyncAttendance);
}
