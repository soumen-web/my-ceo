import { useCallback, useEffect } from 'react';

import type { CreateHrQueryRequest } from '@/modules/hr-query/domain/entities/HrQuery';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createHrQueryRequested,
  loadHrQueriesRequested,
  refreshHrQueriesRequested,
  resetHrQuerySubmitState,
  selectHrQueryErrorMessage,
  selectHrQuerySnapshot,
  selectHrQueryStatus,
  selectHrQuerySubmitErrorMessage,
  selectHrQuerySubmitStatus,
  selectLastSubmittedHrQueryId,
} from '@/store/slices/hrQuerySlice';

export const useHrQueryScreenModel = () => {
  const dispatch = useAppDispatch();
  const snapshot = useAppSelector(selectHrQuerySnapshot);
  const status = useAppSelector(selectHrQueryStatus);
  const errorMessage = useAppSelector(selectHrQueryErrorMessage);
  const submitStatus = useAppSelector(selectHrQuerySubmitStatus);
  const submitErrorMessage = useAppSelector(selectHrQuerySubmitErrorMessage);
  const lastSubmittedQueryId = useAppSelector(selectLastSubmittedHrQueryId);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadHrQueriesRequested());
    }
  }, [dispatch, status]);

  const refresh = useCallback(() => {
    dispatch(refreshHrQueriesRequested());
  }, [dispatch]);

  const submitQuery = useCallback(
    (request: CreateHrQueryRequest) => {
      dispatch(createHrQueryRequested(request));
    },
    [dispatch],
  );

  const resetSubmitState = useCallback(() => {
    dispatch(resetHrQuerySubmitState());
  }, [dispatch]);

  return {
    errorMessage,
    isInitialLoading: status === 'idle' || status === 'loading',
    isRefreshing: status === 'refreshing',
    lastSubmittedQueryId,
    refresh,
    resetSubmitState,
    snapshot,
    status,
    submitErrorMessage,
    submitQuery,
    submitStatus,
  };
};
