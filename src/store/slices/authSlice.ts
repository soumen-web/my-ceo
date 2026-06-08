import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type {
  AuthSession,
  AuthenticatedUser,
  RequestOtpCredentials,
  RestoredSession,
  SignInCredentials,
  VerifyOtpCredentials,
} from '@/modules/auth/domain/entities/AuthSession';
import { accessControlService } from '@/services/access-control/accessControlService';
import type { AccessContext } from '@/services/access-control/types';
import type { LocationCoordinates } from '@/services/location';

import type { RootState } from '../rootReducer';

export interface SignInRequestedPayload {
  commitSession?: boolean;
  credentials: SignInCredentials;
}

export interface RequestOtpRequestedPayload {
  credentials: RequestOtpCredentials;
}

export interface VerifyOtpRequestedPayload {
  credentials: VerifyOtpCredentials;
}

type AuthStatus = 'anonymous' | 'authenticated' | 'idle' | 'loading';

interface AuthState {
  errorMessage: string | null;
  isHydrated: boolean;
  lastCompletedSession: AuthSession | null;
  loginLocation: LocationCoordinates | null;
  lastOtpRequestCode: string | null;
  lastOtpRequestEmail: string | null;
  lastOtpRequestMessage: string | null;
  status: AuthStatus;
  user: AuthenticatedUser | null;
}

const initialState: AuthState = {
  errorMessage: null,
  isHydrated: false,
  lastCompletedSession: null,
  loginLocation: null,
  lastOtpRequestCode: null,
  lastOtpRequestEmail: null,
  lastOtpRequestMessage: null,
  status: 'idle',
  user: null,
};

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    clearSession() {
      const anonymousState: AuthState = {
        ...initialState,
        isHydrated: true,
        status: 'anonymous',
      };

      return anonymousState;
    },
    clearSessionError(state) {
      state.errorMessage = null;
    },
    completeSessionHydration(state, action: PayloadAction<RestoredSession>) {
      state.errorMessage = null;
      state.isHydrated = true;
      state.lastCompletedSession = null;
      state.loginLocation = null;
      state.lastOtpRequestCode = null;
      state.lastOtpRequestEmail = null;
      state.lastOtpRequestMessage = null;
      state.status = action.payload.isAuthenticated
        ? 'authenticated'
        : 'anonymous';
      state.user = action.payload.user;
    },
    resetLastCompletedSession(state) {
      state.lastCompletedSession = null;
    },
    setLoginLocation(
      state,
      action: PayloadAction<LocationCoordinates | null>,
    ) {
      state.loginLocation = action.payload;
    },
    resetLastOtpRequest(state) {
      state.lastOtpRequestCode = null;
      state.lastOtpRequestEmail = null;
      state.lastOtpRequestMessage = null;
    },
    setAuthenticatedSession(
      state,
      action: PayloadAction<{ user: AuthenticatedUser | null }>,
    ) {
      state.errorMessage = null;
      state.isHydrated = true;
      state.lastCompletedSession = null;
      state.loginLocation = null;
      state.lastOtpRequestCode = null;
      state.lastOtpRequestEmail = null;
      state.lastOtpRequestMessage = null;
      state.status = 'authenticated';
      state.user = action.payload.user;
    },
    setAuthenticationPending(state) {
      state.errorMessage = null;
      state.lastCompletedSession = null;
      state.status = 'loading';
    },
    setSessionError(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.isHydrated = true;
      state.lastCompletedSession = null;
      state.loginLocation = null;
      state.status = 'anonymous';
      state.user = null;
    },
    requestOtpCompleted(
      state,
      action: PayloadAction<{
        email: string;
        message?: string;
        otp?: string;
      }>,
    ) {
      state.errorMessage = null;
      state.isHydrated = true;
      state.lastCompletedSession = null;
      state.lastOtpRequestCode = action.payload.otp ?? null;
      state.lastOtpRequestEmail = action.payload.email;
      state.lastOtpRequestMessage = action.payload.message ?? null;
      state.status = 'anonymous';
    },
    requestOtpRequested(state, _action: PayloadAction<RequestOtpRequestedPayload>) {
      state.errorMessage = null;
      state.lastCompletedSession = null;
      state.lastOtpRequestCode = null;
      state.lastOtpRequestEmail = null;
      state.lastOtpRequestMessage = null;
      state.status = 'loading';
    },
    signInCompleted(
      state,
      action: PayloadAction<{
        commitSession: boolean;
        session: AuthSession;
      }>,
    ) {
      state.errorMessage = null;
      state.isHydrated = true;
      state.lastCompletedSession = action.payload.session;
      state.loginLocation = null;
      state.lastOtpRequestCode = null;
      state.lastOtpRequestEmail = null;
      state.lastOtpRequestMessage = null;
      state.status = action.payload.commitSession
        ? 'authenticated'
        : 'anonymous';
      state.user = action.payload.commitSession
        ? action.payload.session.user
        : null;
    },
    signInRequested(state, _action: PayloadAction<SignInRequestedPayload>) {
      state.errorMessage = null;
      state.lastCompletedSession = null;
      state.loginLocation = null;
      state.status = 'loading';
    },
    signOutRequested(state) {
      state.errorMessage = null;
    },
    verifyOtpRequested(state, _action: PayloadAction<VerifyOtpRequestedPayload>) {
      state.errorMessage = null;
      state.lastCompletedSession = null;
      state.loginLocation = null;
      state.status = 'loading';
    },
  },
});

export const {
  clearSession,
  clearSessionError,
  completeSessionHydration,
  requestOtpCompleted,
  requestOtpRequested,
  resetLastCompletedSession,
  resetLastOtpRequest,
  setAuthenticatedSession,
  setAuthenticationPending,
  setSessionError,
  setLoginLocation,
  signInCompleted,
  signInRequested,
  signOutRequested,
  verifyOtpRequested,
} = authSlice.actions;

export const selectAuthState = (state: RootState): AuthState => state.auth;
export const selectAuthErrorMessage = (state: RootState): string | null =>
  state.auth.errorMessage;
export const selectAuthIsHydrated = (state: RootState): boolean =>
  state.auth.isHydrated;
export const selectAuthStatus = (state: RootState): AuthStatus => state.auth.status;
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.status === 'authenticated';
export const selectAuthenticatedUser = (
  state: RootState,
): AuthenticatedUser | null => state.auth.user;
export const selectLastCompletedSession = (
  state: RootState,
): AuthSession | null => state.auth.lastCompletedSession;
export const selectLoginLocation = (
  state: RootState,
): LocationCoordinates | null => state.auth.loginLocation;
export const selectLastOtpRequestCode = (
  state: RootState,
): string | null => state.auth.lastOtpRequestCode;
export const selectLastOtpRequestEmail = (
  state: RootState,
): string | null => state.auth.lastOtpRequestEmail;
export const selectLastOtpRequestMessage = (
  state: RootState,
): string | null => state.auth.lastOtpRequestMessage;
export const selectAccessContext = createSelector(
  [selectAuthState],
  (authState): AccessContext => {
    if (authState.status !== 'authenticated') {
      return accessControlService.buildGuestContext();
    }

    return accessControlService.buildAuthenticatedContext(
      authState.user?.roles,
      authState.user?.capabilities,
    );
  },
);

export const authReducer = authSlice.reducer;
