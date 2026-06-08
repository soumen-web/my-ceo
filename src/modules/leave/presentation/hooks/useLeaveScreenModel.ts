import { useCallback, useEffect, useMemo } from 'react';

import type { ApplyLeaveRequest } from '@/modules/leave/domain/entities/Leave';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  applyLeaveRequested,
  loadLeaveDetailRequested,
  loadLeaveRequested,
  resetLeaveApplyState,
  selectLastAppliedLeaveId,
  selectLeaveApplyErrorMessage,
  selectLeaveApplyStatus,
  selectLeaveDetailErrorMessage,
  selectLeaveDetailStatus,
  selectLeaveErrorMessage,
  selectLeaveLastFetchedAt,
  selectLeaveSelectedDetail,
  selectLeaveSnapshot,
  selectLeaveStatus,
  syncLeaveRequested,
} from '@/store/slices/leaveSlice';

export const useLeaveScreenModel = () => {
  const dispatch = useAppDispatch();
  const snapshot = useAppSelector(selectLeaveSnapshot);
  const status = useAppSelector(selectLeaveStatus);
  const errorMessage = useAppSelector(selectLeaveErrorMessage);
  const applyStatus = useAppSelector(selectLeaveApplyStatus);
  const applyErrorMessage = useAppSelector(selectLeaveApplyErrorMessage);
  const lastAppliedLeaveId = useAppSelector(selectLastAppliedLeaveId);
  const selectedLeave = useAppSelector(selectLeaveSelectedDetail);
  const detailStatus = useAppSelector(selectLeaveDetailStatus);
  const detailErrorMessage = useAppSelector(selectLeaveDetailErrorMessage);
  const lastFetchedAt = useAppSelector(selectLeaveLastFetchedAt);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadLeaveRequested());
    }
  }, [dispatch, status]);

  const refresh = useCallback(() => {
    dispatch(syncLeaveRequested());
  }, [dispatch]);

  const applyLeave = useCallback(
    (request: ApplyLeaveRequest) => {
      dispatch(applyLeaveRequested(request));
    },
    [dispatch],
  );

  const resetApplyState = useCallback(() => {
    dispatch(resetLeaveApplyState());
  }, [dispatch]);

  const loadLeaveDetail = useCallback(
    (id: string) => {
      dispatch(loadLeaveDetailRequested(id));
    },
    [dispatch],
  );

  const totalAvailableDays = useMemo(
    () => snapshot.balances.reduce((total, balance) => total + balance.available, 0),
    [snapshot.balances],
  );
  const nextLeave = snapshot.upcoming[0] ?? snapshot.pendingApprovals[0] ?? null;

  return {
    applyErrorMessage,
    applyLeave,
    applyStatus,
    detailErrorMessage,
    detailStatus,
    errorMessage,
    isInitialLoading: status === 'idle' || status === 'loading',
    isRefreshing: status === 'syncing',
    lastAppliedLeaveId,
    lastFetchedAt,
    loadLeaveDetail,
    nextLeave,
    pendingCount: snapshot.pendingApprovals.length,
    refresh,
    resetApplyState,
    selectedLeave,
    snapshot,
    totalAvailableDays,
  };
};
