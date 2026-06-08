import type { PayloadAction } from '@reduxjs/toolkit';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import { authUseCases } from '@/modules/auth/application/runtime';
import { homeUseCases } from '@/modules/home';
import type { HomeDashboard } from '@/modules/home/domain/entities/HomeDashboard';
import { analyticsService } from '@/services/observability/analytics/analyticsService';
import { locationService } from '@/services/location';
import type { LoginLocationResult } from '@/services/location';
import { observabilityEvents } from '@/services/observability/events';
import { logger } from '@/services/observability/logger/logger';
import { tenantContextService } from '@/services/tenant/tenantContextService';
import { toAppError } from '@/shared/core/errors/AppError';

import type {
  AuthSession,
  RequestOtpResult,
} from '@/modules/auth/domain/entities/AuthSession';
import {
  resetHomeDashboard,
  setHomeDashboard,
} from '../slices/homeSlice';
import { resetHrms } from '../slices/hrmsSlice';
import {
  clearSession,
  requestOtpCompleted,
  requestOtpRequested,
  selectIsAuthenticated,
  setLoginLocation,
  setSessionError,
  signInCompleted,
  signInRequested,
  signOutRequested,
  verifyOtpRequested,
  type RequestOtpRequestedPayload,
  type SignInRequestedPayload,
  type VerifyOtpRequestedPayload,
} from '../slices/authSlice';
import { resetMyOrganization } from '../slices/myOrganizationSlice';

function* hydrateHomeAfterAuthentication(session: AuthSession) {
  yield call([analyticsService, analyticsService.track], observabilityEvents.authLoginSucceeded, {
    userId: session.user.id,
  });
  yield put(resetHomeDashboard());
  yield put(resetHrms());
  yield put(resetMyOrganization());

  try {
    const dashboard: HomeDashboard = yield call([
      homeUseCases.getDashboard,
      homeUseCases.getDashboard.execute,
    ]);
    yield put(setHomeDashboard(dashboard));
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Unable to hydrate Workforce Hub dashboard after sign in.', {
      code: appError.code,
      details: appError.details,
      scope: 'authSaga',
    });
  }
}

function* captureLoginLocation() {
  try {
    const isAuthenticated: boolean = yield select(selectIsAuthenticated);

    if (!isAuthenticated) {
      return;
    }

    const result: LoginLocationResult = yield call([
      locationService,
      locationService.captureLoginLocation,
    ]);
    const shouldStoreLocation: boolean = yield select(selectIsAuthenticated);

    if (!shouldStoreLocation) {
      return;
    }

    if (!result.coordinates) {
      yield put(setLoginLocation(null));
      if (__DEV__) {
        console.info('[Auth] Login location not captured', {
          permissionState: result.permissionState,
        });
      }
      yield call([logger, logger.info], 'Login location not captured.', {
        permissionState: result.permissionState,
        scope: 'authSaga',
      });
      return;
    }

    yield put(setLoginLocation(result.coordinates));
    if (__DEV__) {
      console.info('[Auth] Login location captured', {
        latitude: result.coordinates.latitude,
        longitude: result.coordinates.longitude,
      });
    }
    yield call([logger, logger.info], 'Login location captured.', {
      latitude: result.coordinates.latitude,
      longitude: result.coordinates.longitude,
      scope: 'authSaga',
    });
  } catch (error) {
    yield call([logger, logger.warn], 'Login location capture failed.', {
      message: error instanceof Error ? error.message : 'Unable to capture location',
      scope: 'authSaga',
    });
  }
}

function* failAuthentication(error: unknown, scope: 'login' | 'requestOtp' | 'verifyOtp') {
  const appError = toAppError(error);

  yield call([analyticsService, analyticsService.track], observabilityEvents.authLoginFailed, {
    code: appError.code,
  });
  yield call([logger, logger.warn], 'Authentication failed', {
    code: appError.code,
    details: appError.details,
    scope,
  });
  yield put(setSessionError(appError.userMessage));
  yield call(
    [analyticsService, analyticsService.track],
    observabilityEvents.formValidationFailed,
    { formName: scope === 'requestOtp' ? 'request_otp' : 'sign_in' },
  );
}

function* handleRequestOtp(action: PayloadAction<RequestOtpRequestedPayload>) {
  try {
    const result: RequestOtpResult = yield call(
      [authUseCases.requestLoginOtp, authUseCases.requestLoginOtp.execute],
      action.payload.credentials,
    );

    yield put(requestOtpCompleted(result));
  } catch (error) {
    yield* failAuthentication(error, 'requestOtp');
  }
}

function* handleSignIn(action: PayloadAction<SignInRequestedPayload>) {
  const { commitSession = true, credentials } = action.payload;

  try {
    const session: AuthSession = yield call(
      [authUseCases.loginUser, authUseCases.loginUser.execute],
      credentials,
    );

    yield put(signInCompleted({ commitSession, session }));
    yield fork(captureLoginLocation);
    yield* hydrateHomeAfterAuthentication(session);
  } catch (error) {
    yield* failAuthentication(error, 'login');
  }
}

function* handleVerifyOtp(action: PayloadAction<VerifyOtpRequestedPayload>) {
  try {
    const session: AuthSession = yield call(
      [authUseCases.verifyLoginOtp, authUseCases.verifyLoginOtp.execute],
      action.payload.credentials,
    );

    yield call([logger, logger.info], 'OTP verification succeeded', {
      hasRefreshToken: Boolean(session.refreshToken),
      scope: 'verifyOtp',
      userId: session.user.id,
    });
    yield put(signInCompleted({ commitSession: true, session }));
    yield fork(captureLoginLocation);
    yield* hydrateHomeAfterAuthentication(session);
  } catch (error) {
    yield* failAuthentication(error, 'verifyOtp');
  }
}

function* handleSignOut() {
  try {
    yield call([authUseCases.signOutUser, authUseCases.signOutUser.execute]);
    yield call([tenantContextService, tenantContextService.clearRuntimeTenant]);
    yield put(clearSession(undefined));
    yield put(resetHomeDashboard(undefined));
    yield put(resetHrms(undefined));
    yield put(resetMyOrganization(undefined));
    yield call([analyticsService, analyticsService.track], observabilityEvents.authSignedOut, {
      reason: 'user_action',
    });
  } catch (error) {
    const appError = toAppError(error);

    yield call([logger, logger.warn], 'Sign out failed', {
      code: appError.code,
      details: appError.details,
      scope: 'authSaga',
    });
  }
}

export function* authSaga() {
  yield takeLatest(requestOtpRequested.type, handleRequestOtp);
  yield takeLatest(signInRequested.type, handleSignIn);
  yield takeLatest(signOutRequested.type, handleSignOut);
  yield takeLatest(verifyOtpRequested.type, handleVerifyOtp);
}
