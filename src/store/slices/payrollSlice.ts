import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { PayrollCycle, PayrollSnapshot } from '@/modules/payroll/domain/entities/Payroll';
import { createEmptyPayrollSnapshot } from '@/modules/payroll/domain/entities/Payroll';

import type { RootState } from '../rootReducer';

type PayrollStatus = 'failed' | 'idle' | 'loading' | 'ready' | 'syncing';
type PayrollDetailStatus = 'failed' | 'idle' | 'loading' | 'ready';

interface PayrollState {
  detailErrorMessage: string | null;
  detailStatus: PayrollDetailStatus;
  errorMessage: string | null;
  lastFetchedAt: string | null;
  selectedCycle: PayrollCycle | null;
  snapshot: PayrollSnapshot;
  status: PayrollStatus;
}

const initialState: PayrollState = {
  detailErrorMessage: null,
  detailStatus: 'idle',
  errorMessage: null,
  lastFetchedAt: null,
  selectedCycle: null,
  snapshot: createEmptyPayrollSnapshot(),
  status: 'idle',
};

const payrollSlice = createSlice({
  initialState,
  name: 'payroll',
  reducers: {
    loadPayrollCycleFailed(state, action: PayloadAction<string>) {
      state.detailErrorMessage = action.payload;
      state.detailStatus = 'failed';
    },
    loadPayrollCycleRequested(state, _action: PayloadAction<string>) {
      state.detailErrorMessage = null;
      state.detailStatus = 'loading';
      state.selectedCycle = null;
    },
    loadPayrollCycleSucceeded(state, action: PayloadAction<PayrollCycle | null>) {
      state.detailErrorMessage = null;
      state.detailStatus = 'ready';
      state.selectedCycle = action.payload;
    },
    loadPayrollFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.status = 'failed';
    },
    loadPayrollRequested(state) {
      state.errorMessage = null;
      state.status = 'loading';
    },
    loadPayrollSucceeded(state, action: PayloadAction<PayrollSnapshot>) {
      state.errorMessage = null;
      state.lastFetchedAt = new Date().toISOString();
      state.snapshot = action.payload;
      state.status = 'ready';
    },
    resetPayroll(state) {
      state.detailErrorMessage = null;
      state.detailStatus = 'idle';
      state.errorMessage = null;
      state.lastFetchedAt = null;
      state.selectedCycle = null;
      state.snapshot = createEmptyPayrollSnapshot();
      state.status = 'idle';
    },
    syncPayrollFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.status = 'failed';
    },
    syncPayrollRequested(state) {
      state.errorMessage = null;
      state.status = 'syncing';
    },
    syncPayrollSucceeded(state, action: PayloadAction<PayrollSnapshot>) {
      state.errorMessage = null;
      state.lastFetchedAt = new Date().toISOString();
      state.snapshot = action.payload;
      state.status = 'ready';
    },
  },
});

export const {
  loadPayrollCycleFailed,
  loadPayrollCycleRequested,
  loadPayrollCycleSucceeded,
  loadPayrollFailed,
  loadPayrollRequested,
  loadPayrollSucceeded,
  resetPayroll,
  syncPayrollFailed,
  syncPayrollRequested,
  syncPayrollSucceeded,
} = payrollSlice.actions;

export const selectPayrollSnapshot = (state: RootState): PayrollSnapshot =>
  state.payroll.snapshot;

export const selectPayrollStatus = (state: RootState): PayrollStatus =>
  state.payroll.status;

export const selectPayrollErrorMessage = (state: RootState): string | null =>
  state.payroll.errorMessage;

export const selectPayrollLastFetchedAt = (state: RootState): string | null =>
  state.payroll.lastFetchedAt;

export const selectSelectedPayrollCycle = (state: RootState): PayrollCycle | null =>
  state.payroll.selectedCycle;

export const selectPayrollDetailStatus = (state: RootState): PayrollDetailStatus =>
  state.payroll.detailStatus;

export const selectPayrollDetailErrorMessage = (state: RootState): string | null =>
  state.payroll.detailErrorMessage;

export const payrollReducer = payrollSlice.reducer;
