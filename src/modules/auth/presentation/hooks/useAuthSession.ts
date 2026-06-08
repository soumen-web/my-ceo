import { authUseCases } from '@/modules/auth/application/runtime';
import {
  selectAuthState,
  signOutRequested,
} from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export const useAuthSession = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuthState);

  return {
    ...authState,
    deleteAccount: async () => {
      await authUseCases.deleteAccount.execute();
    },
    signOut: async () => {
      dispatch(signOutRequested(undefined));
    },
  };
};
