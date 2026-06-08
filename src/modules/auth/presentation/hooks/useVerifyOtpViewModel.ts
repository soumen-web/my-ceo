import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearSessionError,
  selectAuthErrorMessage,
  selectAuthStatus,
  verifyOtpRequested,
} from '@/store/slices/authSlice';

export const useVerifyOtpViewModel = () => {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(selectAuthErrorMessage);
  const status = useAppSelector(selectAuthStatus);

  return {
    errorMessage,
    isPending: status === 'loading',
    verifyOtp: async (email: string, otp: string) => {
      dispatch(clearSessionError(undefined));
      dispatch(
        verifyOtpRequested({
          credentials: {
            email,
            otp,
          },
        }),
      );
    },
  };
};
