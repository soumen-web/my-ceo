import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';

import { hrmsUseCases } from '@/modules/hrms';
import type { HrmsSelfServiceSnapshot } from '@/modules/hrms/domain/entities/HrmsSelfService';
import { logger } from '@/services/observability/logger/logger';
import { toAppError } from '@/shared/core/errors/AppError';

import {
  type HrmsSelfServiceAccessPayload,
  loadHrmsSelfServiceFailed,
  loadHrmsSelfServiceRequested,
  loadHrmsSelfServiceSucceeded,
} from '../slices/hrmsSlice';

function* handleLoadHrmsSelfService(
  action: PayloadAction<HrmsSelfServiceAccessPayload | undefined>,
) {
  try {
    const access = action.payload ?? {
      canViewOrganizationEmployees: false,
    };
    const snapshot: HrmsSelfServiceSnapshot = yield call([
      hrmsUseCases.getSelfServiceSnapshot,
      hrmsUseCases.getSelfServiceSnapshot.execute,
    ], access);

    yield put(loadHrmsSelfServiceSucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load Workforce Hub state.', {
      code: appError.code,
      details: appError.details,
      scope: 'hrmsSaga',
    });
    yield put(loadHrmsSelfServiceFailed(appError.userMessage));
  }
}

export function* hrmsSaga() {
  yield takeLatest(loadHrmsSelfServiceRequested.type, handleLoadHrmsSelfService);
}
