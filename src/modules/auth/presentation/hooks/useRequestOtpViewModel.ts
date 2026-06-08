import { useEffect, useRef } from 'react';

import type { RequestOtpResult } from '@/modules/auth/domain/entities/AuthSession';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearSessionError,
  requestOtpRequested,
  resetLastOtpRequest,
  selectAuthErrorMessage,
  selectAuthStatus,
  selectLastOtpRequestCode,
  selectLastOtpRequestEmail,
  selectLastOtpRequestMessage,
} from '@/store/slices/authSlice';

export const useRequestOtpViewModel = (
  onOtpSent?: (result: RequestOtpResult) => void,
) => {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(selectAuthErrorMessage);
  const lastOtpCode = useAppSelector(selectLastOtpRequestCode);
  const lastOtpEmail = useAppSelector(selectLastOtpRequestEmail);
  const lastOtpMessage = useAppSelector(selectLastOtpRequestMessage);
  const status = useAppSelector(selectAuthStatus);
  const handledRequestRef = useRef<string | null>(null);

  useEffect(() => {
    if (!lastOtpEmail) {
      handledRequestRef.current = null;
      return;
    }

    const requestKey = [lastOtpEmail, lastOtpCode, lastOtpMessage].join(':');

    if (handledRequestRef.current === requestKey) {
      return;
    }

    handledRequestRef.current = requestKey;

    if (onOtpSent) {
      onOtpSent({
        email: lastOtpEmail,
        ...(lastOtpMessage ? { message: lastOtpMessage } : {}),
        ...(lastOtpCode ? { otp: lastOtpCode } : {}),
      });
    }

    dispatch(resetLastOtpRequest(undefined));
  }, [dispatch, lastOtpCode, lastOtpEmail, lastOtpMessage, onOtpSent]);

  return {
    errorMessage,
    isPending: status === 'loading',
    requestOtp: async (email: string) => {
      dispatch(clearSessionError(undefined));
      dispatch(
        requestOtpRequested({
          credentials: {
            email,
          },
        }),
      );
    },
  };
};
