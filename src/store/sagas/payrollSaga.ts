import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';

import { payrollUseCases } from '@/modules/payroll';
import type {
  PayrollCycle,
  PayrollSnapshot,
} from '@/modules/payroll/domain/entities/Payroll';
import { logger } from '@/services/observability/logger/logger';
import { toAppError } from '@/shared/core/errors/AppError';

import {
  loadPayrollCycleFailed,
  loadPayrollCycleRequested,
  loadPayrollCycleSucceeded,
  loadPayrollFailed,
  loadPayrollRequested,
  loadPayrollSucceeded,
  syncPayrollFailed,
  syncPayrollRequested,
  syncPayrollSucceeded,
} from '../slices/payrollSlice';

function* handleLoadPayroll() {
  try {
    const snapshot: PayrollSnapshot = yield call([
      payrollUseCases.getPayrollSnapshot,
      payrollUseCases.getPayrollSnapshot.execute,
    ]);

    yield put(loadPayrollSucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load payroll overview.', {
      code: appError.code,
      details: appError.details,
      scope: 'payrollSaga',
    });
    yield put(loadPayrollFailed(appError.userMessage));
  }
}

function* handleSyncPayroll() {
  try {
    const snapshot: PayrollSnapshot = yield call([
      payrollUseCases.getPayrollSnapshot,
      payrollUseCases.getPayrollSnapshot.execute,
    ]);

    yield put(syncPayrollSucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to refresh payroll overview.', {
      code: appError.code,
      details: appError.details,
      scope: 'payrollSaga',
    });
    yield put(syncPayrollFailed(appError.userMessage));
  }
}

function* handleLoadPayrollCycle(action: PayloadAction<string>) {
  try {
    const cycle: PayrollCycle | null = yield call([
      payrollUseCases.getPayrollCycle,
      payrollUseCases.getPayrollCycle.execute,
    ], action.payload);

    yield put(loadPayrollCycleSucceeded(cycle));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load payroll cycle.', {
      code: appError.code,
      details: appError.details,
      scope: 'payrollSaga',
    });
    yield put(loadPayrollCycleFailed(appError.userMessage));
  }
}

export function* payrollSaga() {
  yield takeLatest(loadPayrollRequested.type, handleLoadPayroll);
  yield takeLatest(syncPayrollRequested.type, handleSyncPayroll);
  yield takeLatest(loadPayrollCycleRequested.type, handleLoadPayrollCycle);
}
