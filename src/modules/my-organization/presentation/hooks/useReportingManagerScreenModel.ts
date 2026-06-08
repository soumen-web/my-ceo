import { useCallback, useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadReportingManagerRequested,
  selectReportingManager,
  selectReportingManagerErrorMessage,
  selectReportingManagerStatus,
} from '@/store/slices/myOrganizationSlice';

import { toReportingManagerViewModel } from '../mappers/toReportingManagerViewModel';

export const useReportingManagerScreenModel = () => {
  const dispatch = useAppDispatch();
  const reportingManager = useAppSelector(selectReportingManager);
  const errorMessage = useAppSelector(selectReportingManagerErrorMessage);
  const status = useAppSelector(selectReportingManagerStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadReportingManagerRequested());
    }
  }, [dispatch, status]);

  const refresh = useCallback(() => {
    dispatch(loadReportingManagerRequested());
  }, [dispatch]);

  const viewModel = useMemo(
    () => toReportingManagerViewModel(reportingManager),
    [reportingManager],
  );

  return {
    errorMessage,
    isRefreshing: status === 'loading',
    reportingManager: viewModel,
    refresh,
    status,
  };
};
