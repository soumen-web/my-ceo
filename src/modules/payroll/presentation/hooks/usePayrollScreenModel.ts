import { useCallback, useEffect, useMemo } from 'react';

import type { PayrollCycle } from '@/modules/payroll/domain/entities/Payroll';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadPayrollCycleRequested,
  loadPayrollRequested,
  selectPayrollDetailErrorMessage,
  selectPayrollDetailStatus,
  selectPayrollErrorMessage,
  selectPayrollLastFetchedAt,
  selectPayrollSnapshot,
  selectPayrollStatus,
  selectSelectedPayrollCycle,
  syncPayrollRequested,
} from '@/store/slices/payrollSlice';

export const usePayrollScreenModel = () => {
  const dispatch = useAppDispatch();
  const snapshot = useAppSelector(selectPayrollSnapshot);
  const status = useAppSelector(selectPayrollStatus);
  const errorMessage = useAppSelector(selectPayrollErrorMessage);
  const lastFetchedAt = useAppSelector(selectPayrollLastFetchedAt);
  const selectedCycle = useAppSelector(selectSelectedPayrollCycle);
  const detailStatus = useAppSelector(selectPayrollDetailStatus);
  const detailErrorMessage = useAppSelector(selectPayrollDetailErrorMessage);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadPayrollRequested());
    }
  }, [dispatch, status]);

  const refresh = useCallback(() => {
    dispatch(syncPayrollRequested());
  }, [dispatch]);

  const loadPayrollCycle = useCallback(
    (cycleId: string) => {
      dispatch(loadPayrollCycleRequested(cycleId));
    },
    [dispatch],
  );

  const paidCycles = useMemo(
    () => snapshot.history.filter((cycle) => cycle.status === 'paid').length,
    [snapshot.history],
  );

  const payrollDelta = useMemo(() => {
    const [current, previous] = snapshot.history;

    if (!current || !previous || previous.netSalary === 0) {
      return 0;
    }

    return Math.round(((current.netSalary - previous.netSalary) / previous.netSalary) * 100);
  }, [snapshot.history]);

  const resolveCycle = useCallback(
    (cycleId: string): PayrollCycle | null =>
      snapshot.history.find((cycle) => cycle.id === cycleId) ?? selectedCycle,
    [selectedCycle, snapshot.history],
  );

  return {
    detailErrorMessage,
    detailStatus,
    errorMessage,
    isInitialLoading: status === 'idle' || status === 'loading',
    isRefreshing: status === 'syncing',
    lastFetchedAt,
    loadPayrollCycle,
    paidCycles,
    payrollDelta,
    refresh,
    resolveCycle,
    selectedCycle,
    snapshot,
    status,
  };
};
