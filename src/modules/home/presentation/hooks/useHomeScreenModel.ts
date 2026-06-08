import { useCallback, useEffect } from 'react';

import { toAuthenticatedUserViewModel, useAuthSession } from '@modules/auth';
import {
  selectHomeErrorMessage,
  loadHomeDashboardRequested,
  selectHomeDashboard,
  selectHomeStatus,
} from '@/store/slices/homeSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export const useHomeScreenModel = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuthSession();
  const dashboard = useAppSelector(selectHomeDashboard);
  const errorMessage = useAppSelector(selectHomeErrorMessage);
  const status = useAppSelector(selectHomeStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadHomeDashboardRequested());
    }
  }, [dispatch, status]);

  const refreshDashboard = useCallback(() => {
    dispatch(loadHomeDashboardRequested());
  }, [dispatch]);

  return {
    dashboard,
    errorMessage,
    isRefreshing: status === 'loading',
    refreshDashboard,
    status,
    user: toAuthenticatedUserViewModel(user),
  };
};
