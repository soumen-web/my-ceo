import { call, put, takeLatest } from 'redux-saga/effects';

import { myOrganizationUseCases } from '@/modules/my-organization';
import type { MyOrganizationProfile } from '@/modules/my-organization/domain/entities/MyOrganizationProfile';
import type { OrganizationInfo } from '@/modules/my-organization/domain/entities/OrganizationInfo';
import type { ReportingManagerInfo } from '@/modules/my-organization/domain/entities/ReportingManagerInfo';
import type { TeamInfo } from '@/modules/my-organization/domain/entities/TeamInfo';
import type { WorkLocationInfo } from '@/modules/my-organization/domain/entities/WorkLocationInfo';
import type { WorkModeInfo } from '@/modules/my-organization/domain/entities/WorkModeInfo';
import { logger } from '@/services/observability/logger/logger';
import { toAppError } from '@/shared/core/errors/AppError';

import {
  loadMyOrganizationFailed,
  loadMyOrganizationRequested,
  loadMyOrganizationSucceeded,
  loadOrganizationInfoFailed,
  loadOrganizationInfoRequested,
  loadOrganizationInfoSucceeded,
  loadMyTeamFailed,
  loadMyTeamRequested,
  loadMyTeamSucceeded,
  loadReportingManagerFailed,
  loadReportingManagerRequested,
  loadReportingManagerSucceeded,
  loadWorkLocationFailed,
  loadWorkLocationRequested,
  loadWorkLocationSucceeded,
  loadWorkModeFailed,
  loadWorkModeRequested,
  loadWorkModeSucceeded,
} from '../slices/myOrganizationSlice';

function* handleLoadMyOrganization() {
  try {
    const profile: MyOrganizationProfile = yield call([
      myOrganizationUseCases.getMyOrganizationProfile,
      myOrganizationUseCases.getMyOrganizationProfile.execute,
    ]);

    yield put(loadMyOrganizationSucceeded(profile));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load my organization profile state.', {
      code: appError.code,
      details: appError.details,
      scope: 'myOrganizationSaga',
    });
    yield put(loadMyOrganizationFailed(appError.userMessage));
  }
}

function* handleLoadOrganizationInfo() {
  try {
    const organizationInfo: OrganizationInfo = yield call([
      myOrganizationUseCases.getOrganizationInfo,
      myOrganizationUseCases.getOrganizationInfo.execute,
    ]);

    yield put(loadOrganizationInfoSucceeded(organizationInfo));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load organization info state.', {
      code: appError.code,
      details: appError.details,
      scope: 'myOrganizationSaga',
    });
    yield put(loadOrganizationInfoFailed(appError.userMessage));
  }
}

function* handleLoadMyTeam() {
  try {
    const team: TeamInfo = yield call([
      myOrganizationUseCases.getMyTeam,
      myOrganizationUseCases.getMyTeam.execute,
    ]);

    yield put(loadMyTeamSucceeded(team));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load my team state.', {
      code: appError.code,
      details: appError.details,
      scope: 'myOrganizationSaga',
    });
    yield put(loadMyTeamFailed(appError.userMessage));
  }
}

function* handleLoadReportingManager() {
  try {
    const reportingManager: ReportingManagerInfo = yield call([
      myOrganizationUseCases.getReportingManager,
      myOrganizationUseCases.getReportingManager.execute,
    ]);

    yield put(loadReportingManagerSucceeded(reportingManager));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load reporting manager state.', {
      code: appError.code,
      details: appError.details,
      scope: 'myOrganizationSaga',
    });
    yield put(loadReportingManagerFailed(appError.userMessage));
  }
}

function* handleLoadWorkLocation() {
  try {
    const workLocation: WorkLocationInfo = yield call([
      myOrganizationUseCases.getWorkLocation,
      myOrganizationUseCases.getWorkLocation.execute,
    ]);

    yield put(loadWorkLocationSucceeded(workLocation));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load work location state.', {
      code: appError.code,
      details: appError.details,
      scope: 'myOrganizationSaga',
    });
    yield put(loadWorkLocationFailed(appError.userMessage));
  }
}

function* handleLoadWorkMode() {
  try {
    const workMode: WorkModeInfo = yield call([
      myOrganizationUseCases.getWorkMode,
      myOrganizationUseCases.getWorkMode.execute,
    ]);

    yield put(loadWorkModeSucceeded(workMode));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to load work mode state.', {
      code: appError.code,
      details: appError.details,
      scope: 'myOrganizationSaga',
    });
    yield put(loadWorkModeFailed(appError.userMessage));
  }
}

export function* myOrganizationSaga() {
  yield takeLatest(loadMyOrganizationRequested.type, handleLoadMyOrganization);
  yield takeLatest(loadOrganizationInfoRequested.type, handleLoadOrganizationInfo);
  yield takeLatest(loadMyTeamRequested.type, handleLoadMyTeam);
  yield takeLatest(loadReportingManagerRequested.type, handleLoadReportingManager);
  yield takeLatest(loadWorkLocationRequested.type, handleLoadWorkLocation);
  yield takeLatest(loadWorkModeRequested.type, handleLoadWorkMode);
}
