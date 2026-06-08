import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';

import { leaveUseCases } from '@/modules/leave';
import type {
  LeaveRequest,
  LeaveSnapshot,
} from '@/modules/leave/domain/entities/Leave';
import { logger } from '@/services/observability/logger/logger';
import { toAppError } from '@/shared/core/errors/AppError';

import {
  applyLeaveFailed,
  applyLeaveRequested,
  applyLeaveSucceeded,
  type ApplyLeavePayload,
  loadLeaveDetailFailed,
  loadLeaveDetailRequested,
  loadLeaveDetailSucceeded,
  loadLeaveFailed,
  loadLeaveRequested,
  loadLeaveSucceeded,
  syncLeaveFailed,
  syncLeaveRequested,
  syncLeaveSucceeded,
} from '../slices/leaveSlice';

function* handleLoadLeave() {
  try {
    const snapshot: LeaveSnapshot = yield call([
      leaveUseCases.getSnapshot,
      leaveUseCases.getSnapshot.execute,
    ]);

    yield put(loadLeaveSucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load leave overview.', {
      code: appError.code,
      details: appError.details,
      scope: 'leaveSaga',
    });
    yield put(loadLeaveFailed(appError.userMessage));
  }
}

function* handleSyncLeave() {
  try {
    const snapshot: LeaveSnapshot = yield call([
      leaveUseCases.getSnapshot,
      leaveUseCases.getSnapshot.execute,
    ]);

    yield put(syncLeaveSucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to sync leave overview.', {
      code: appError.code,
      details: appError.details,
      scope: 'leaveSaga',
    });
    yield put(syncLeaveFailed(appError.userMessage));
  }
}

function* handleApplyLeave(action: PayloadAction<ApplyLeavePayload>) {
  try {
    const snapshot: LeaveSnapshot = yield call([
      leaveUseCases.applyLeave,
      leaveUseCases.applyLeave.execute,
    ], action.payload);

    yield put(applyLeaveSucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to apply leave.', {
      code: appError.code,
      details: appError.details,
      scope: 'leaveSaga',
    });
    yield put(applyLeaveFailed(appError.userMessage));
  }
}

function* handleLoadLeaveDetail(action: PayloadAction<string>) {
  try {
    const leave: LeaveRequest | null = yield call([
      leaveUseCases.getDetail,
      leaveUseCases.getDetail.execute,
    ], action.payload);

    yield put(loadLeaveDetailSucceeded(leave));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load leave detail.', {
      code: appError.code,
      details: appError.details,
      scope: 'leaveSaga',
    });
    yield put(loadLeaveDetailFailed(appError.userMessage));
  }
}

export function* leaveSaga() {
  yield takeLatest(loadLeaveRequested.type, handleLoadLeave);
  yield takeLatest(syncLeaveRequested.type, handleSyncLeave);
  yield takeLatest(applyLeaveRequested.type, handleApplyLeave);
  yield takeLatest(loadLeaveDetailRequested.type, handleLoadLeaveDetail);
}
