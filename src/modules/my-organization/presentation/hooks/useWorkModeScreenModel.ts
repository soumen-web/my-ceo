import { useCallback, useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadWorkModeRequested,
  selectWorkMode,
  selectWorkModeErrorMessage,
  selectWorkModeStatus,
} from '@/store/slices/myOrganizationSlice';

import { toWorkModeViewModel } from '../mappers/toWorkModeViewModel';

export const useWorkModeScreenModel = () => {
  const dispatch = useAppDispatch();
  const workMode = useAppSelector(selectWorkMode);
  const errorMessage = useAppSelector(selectWorkModeErrorMessage);
  const status = useAppSelector(selectWorkModeStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadWorkModeRequested());
    }
  }, [dispatch, status]);

  const refresh = useCallback(() => {
    dispatch(loadWorkModeRequested());
  }, [dispatch]);

  const viewModel = useMemo(() => toWorkModeViewModel(workMode), [workMode]);

  return {
    errorMessage,
    isRefreshing: status === 'loading',
    refresh,
    status,
    workMode: viewModel,
  };
};
