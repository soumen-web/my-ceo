import type { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';

import { hrQueryUseCases } from '@/modules/hr-query';
import type { HrQuerySnapshot } from '@/modules/hr-query/domain/entities/HrQuery';
import { logger } from '@/services/observability/logger/logger';
import { toAppError } from '@/shared/core/errors/AppError';

import {
  createHrQueryFailed,
  createHrQueryRequested,
  createHrQuerySucceeded,
  type CreateHrQueryPayload,
  loadHrQueriesFailed,
  loadHrQueriesRequested,
  loadHrQueriesSucceeded,
  refreshHrQueriesFailed,
  refreshHrQueriesRequested,
  refreshHrQueriesSucceeded,
} from '../slices/hrQuerySlice';

function* handleLoadHrQueries() {
  try {
    const snapshot: HrQuerySnapshot = yield call([
      hrQueryUseCases.getQueries,
      hrQueryUseCases.getQueries.execute,
    ]);

    yield put(loadHrQueriesSucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load HR queries.', {
      code: appError.code,
      details: appError.details,
      scope: 'hrQuerySaga',
    });
    yield put(loadHrQueriesFailed(appError.userMessage));
  }
}

function* handleRefreshHrQueries() {
  try {
    const snapshot: HrQuerySnapshot = yield call([
      hrQueryUseCases.getQueries,
      hrQueryUseCases.getQueries.execute,
    ]);

    yield put(refreshHrQueriesSucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to refresh HR queries.', {
      code: appError.code,
      details: appError.details,
      scope: 'hrQuerySaga',
    });
    yield put(refreshHrQueriesFailed(appError.userMessage));
  }
}

function* handleCreateHrQuery(action: PayloadAction<CreateHrQueryPayload>) {
  try {
    const snapshot: HrQuerySnapshot = yield call([
      hrQueryUseCases.createQuery,
      hrQueryUseCases.createQuery.execute,
    ], action.payload);

    yield put(createHrQuerySucceeded(snapshot));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to submit HR query.', {
      code: appError.code,
      details: appError.details,
      scope: 'hrQuerySaga',
    });
    yield put(createHrQueryFailed(appError.userMessage));
  }
}

export function* hrQuerySaga() {
  yield takeLatest(loadHrQueriesRequested.type, handleLoadHrQueries);
  yield takeLatest(refreshHrQueriesRequested.type, handleRefreshHrQueries);
  yield takeLatest(createHrQueryRequested.type, handleCreateHrQuery);
}
