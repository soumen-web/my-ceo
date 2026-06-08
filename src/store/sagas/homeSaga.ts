import { call, put, takeLatest } from 'redux-saga/effects';

import { homeUseCases } from '@/modules/home';
import type { HomeDashboard } from '@/modules/home/domain/entities/HomeDashboard';
import { logger } from '@/services/observability/logger/logger';
import { toAppError } from '@/shared/core/errors/AppError';

import {
  loadHomeDashboardFailed,
  loadHomeDashboardRequested,
  loadHomeDashboardSucceeded,
} from '../slices/homeSlice';

function* handleLoadHome() {
  try {
    const dashboard: HomeDashboard = yield call([
      homeUseCases.getDashboard,
      homeUseCases.getDashboard.execute,
    ]);

    yield put(loadHomeDashboardSucceeded(dashboard));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load Workforce Hub dashboard state.', {
      code: appError.code,
      details: appError.details,
      scope: 'homeSaga',
    });
    yield put(loadHomeDashboardFailed(appError.userMessage));
  }
}

export function* homeSaga() {
  yield takeLatest(loadHomeDashboardRequested.type, handleLoadHome);
}
