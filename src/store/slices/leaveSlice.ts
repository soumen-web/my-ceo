import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  ApplyLeaveRequest,
  LeaveRequest,
  LeaveSnapshot,
} from '@/modules/leave/domain/entities/Leave';
import { createEmptyLeaveSnapshot } from '@/modules/leave/domain/entities/Leave';

import type { RootState } from '../rootReducer';

type LeaveStatus = 'failed' | 'idle' | 'loading' | 'ready' | 'syncing';
type LeaveApplyStatus = 'failed' | 'idle' | 'loading' | 'ready';
type LeaveDetailStatus = 'failed' | 'idle' | 'loading' | 'ready';

export type ApplyLeavePayload = ApplyLeaveRequest;

interface LeaveState {
  applyErrorMessage: string | null;
  applyStatus: LeaveApplyStatus;
  detailErrorMessage: string | null;
  detailStatus: LeaveDetailStatus;
  errorMessage: string | null;
  lastAppliedLeaveId: string | null;
  lastFetchedAt: string | null;
  selectedLeave: LeaveRequest | null;
  snapshot: LeaveSnapshot;
  status: LeaveStatus;
}

const initialState: LeaveState = {
  applyErrorMessage: null,
  applyStatus: 'idle',
  detailErrorMessage: null,
  detailStatus: 'idle',
  errorMessage: null,
  lastAppliedLeaveId: null,
  lastFetchedAt: null,
  selectedLeave: null,
  snapshot: createEmptyLeaveSnapshot(),
  status: 'idle',
};

const leaveSlice = createSlice({
  initialState,
  name: 'leave',
  reducers: {
    applyLeaveFailed(state, action: PayloadAction<string>) {
      state.applyErrorMessage = action.payload;
      state.applyStatus = 'failed';
    },
    applyLeaveRequested(state, _action: PayloadAction<ApplyLeavePayload>) {
      state.applyErrorMessage = null;
      state.applyStatus = 'loading';
      state.lastAppliedLeaveId = null;
    },
    applyLeaveSucceeded(state, action: PayloadAction<LeaveSnapshot>) {
      const latestPendingLeave = action.payload.pendingApprovals[0] ?? null;

      state.applyErrorMessage = null;
      state.applyStatus = 'ready';
      state.lastAppliedLeaveId = latestPendingLeave?.id ?? null;
      state.lastFetchedAt = new Date().toISOString();
      state.snapshot = action.payload;
      state.status = 'ready';
    },
    loadLeaveDetailFailed(state, action: PayloadAction<string>) {
      state.detailErrorMessage = action.payload;
      state.detailStatus = 'failed';
    },
    loadLeaveDetailRequested(state, _action: PayloadAction<string>) {
      state.detailErrorMessage = null;
      state.detailStatus = 'loading';
      state.selectedLeave = null;
    },
    loadLeaveDetailSucceeded(state, action: PayloadAction<LeaveRequest | null>) {
      state.detailErrorMessage = null;
      state.detailStatus = 'ready';
      state.selectedLeave = action.payload;
    },
    loadLeaveFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.status = 'failed';
    },
    loadLeaveRequested(state) {
      state.errorMessage = null;
      state.status = 'loading';
    },
    loadLeaveSucceeded(state, action: PayloadAction<LeaveSnapshot>) {
      state.errorMessage = null;
      state.lastFetchedAt = new Date().toISOString();
      state.snapshot = action.payload;
      state.status = 'ready';
    },
    resetLeave(state) {
      state.applyErrorMessage = null;
      state.applyStatus = 'idle';
      state.detailErrorMessage = null;
      state.detailStatus = 'idle';
      state.errorMessage = null;
      state.lastAppliedLeaveId = null;
      state.lastFetchedAt = null;
      state.selectedLeave = null;
      state.snapshot = createEmptyLeaveSnapshot();
      state.status = 'idle';
    },
    resetLeaveApplyState(state) {
      state.applyErrorMessage = null;
      state.applyStatus = 'idle';
      state.lastAppliedLeaveId = null;
    },
    syncLeaveFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.status = 'failed';
    },
    syncLeaveRequested(state) {
      state.errorMessage = null;
      state.status = 'syncing';
    },
    syncLeaveSucceeded(state, action: PayloadAction<LeaveSnapshot>) {
      state.errorMessage = null;
      state.lastFetchedAt = new Date().toISOString();
      state.snapshot = action.payload;
      state.status = 'ready';
    },
  },
});

export const {
  applyLeaveFailed,
  applyLeaveRequested,
  applyLeaveSucceeded,
  loadLeaveDetailFailed,
  loadLeaveDetailRequested,
  loadLeaveDetailSucceeded,
  loadLeaveFailed,
  loadLeaveRequested,
  loadLeaveSucceeded,
  resetLeave,
  resetLeaveApplyState,
  syncLeaveFailed,
  syncLeaveRequested,
  syncLeaveSucceeded,
} = leaveSlice.actions;

export const selectLeaveSnapshot = (state: RootState): LeaveSnapshot => state.leave.snapshot;

export const selectLeaveStatus = (state: RootState): LeaveStatus => state.leave.status;

export const selectLeaveErrorMessage = (state: RootState): string | null =>
  state.leave.errorMessage;

export const selectLeaveApplyStatus = (state: RootState): LeaveApplyStatus =>
  state.leave.applyStatus;

export const selectLeaveApplyErrorMessage = (state: RootState): string | null =>
  state.leave.applyErrorMessage;

export const selectLastAppliedLeaveId = (state: RootState): string | null =>
  state.leave.lastAppliedLeaveId;

export const selectLeaveSelectedDetail = (state: RootState): LeaveRequest | null =>
  state.leave.selectedLeave;

export const selectLeaveDetailStatus = (state: RootState): LeaveDetailStatus =>
  state.leave.detailStatus;

export const selectLeaveDetailErrorMessage = (state: RootState): string | null =>
  state.leave.detailErrorMessage;

export const selectLeaveLastFetchedAt = (state: RootState): string | null =>
  state.leave.lastFetchedAt;

export const leaveReducer = leaveSlice.reducer;
