import { useCallback, useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadWorkLocationRequested,
  selectWorkLocation,
  selectWorkLocationErrorMessage,
  selectWorkLocationStatus,
} from '@/store/slices/myOrganizationSlice';

import { toWorkLocationViewModel } from '../mappers/toWorkLocationViewModel';

export const useWorkLocationScreenModel = () => {
  const dispatch = useAppDispatch();
  const workLocation = useAppSelector(selectWorkLocation);
  const errorMessage = useAppSelector(selectWorkLocationErrorMessage);
  const status = useAppSelector(selectWorkLocationStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadWorkLocationRequested());
    }
  }, [dispatch, status]);

  const refresh = useCallback(() => {
    dispatch(loadWorkLocationRequested());
  }, [dispatch]);

  const viewModel = useMemo(
    () => toWorkLocationViewModel(workLocation),
    [workLocation],
  );

  return {
    errorMessage,
    isRefreshing: status === 'loading',
    refresh,
    status,
    workLocation: viewModel,
  };
};
