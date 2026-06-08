import { useEffect, useRef } from 'react';

import {
  clearSessionError,
  selectAuthErrorMessage,
  selectAuthStatus,
  selectLastCompletedSession,
  resetLastCompletedSession,
  signInRequested,
} from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import type { AuthSession, SignInCredentials } from '@/modules/auth/domain/entities/AuthSession';

export const useLoginViewModel = (
  onLoginSucceeded?: (session: AuthSession) => void,
) => {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(selectAuthErrorMessage);
  const lastCompletedSession = useAppSelector(selectLastCompletedSession);
  const status = useAppSelector(selectAuthStatus);
  const handledSessionKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!lastCompletedSession) {
      handledSessionKeyRef.current = null;
      return;
    }

    const sessionKey = `${lastCompletedSession.user.id}:${lastCompletedSession.accessToken}`;

    if (handledSessionKeyRef.current === sessionKey) {
      return;
    }

    handledSessionKeyRef.current = sessionKey;

    if (onLoginSucceeded) {
      onLoginSucceeded(lastCompletedSession);
    }

    dispatch(resetLastCompletedSession(undefined));
  }, [dispatch, lastCompletedSession, onLoginSucceeded]);

  return {
    errorMessage,
    isPending: status === 'loading',
    submit: async (credentials: SignInCredentials) => {
      dispatch(clearSessionError(undefined));
      dispatch(
        signInRequested({
          commitSession: !onLoginSucceeded,
          credentials,
        }),
      );
    },
  };
};
