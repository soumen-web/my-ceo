import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  createEmptyHrmsSelfServiceSnapshot,
  type HrmsSelfServiceSnapshot,
} from '@/modules/hrms/domain/entities/HrmsSelfService';

import type { RootState } from '../rootReducer';

type HrmsStatus = 'failed' | 'idle' | 'loading' | 'ready';

export interface HrmsSelfServiceAccessPayload {
  canViewOrganizationEmployees: boolean;
}

interface HrmsState {
  errorMessage: string | null;
  lastFetchedAt: string | null;
  selfService: HrmsSelfServiceSnapshot;
  status: HrmsStatus;
}

const initialState: HrmsState = {
  errorMessage: null,
  lastFetchedAt: null,
  selfService: createEmptyHrmsSelfServiceSnapshot(),
  status: 'idle',
};

const hrmsSlice = createSlice({
  initialState,
  name: 'hrms',
  reducers: {
    loadHrmsSelfServiceFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.status = 'failed';
    },
    loadHrmsSelfServiceRequested(
      state,
      _action: PayloadAction<HrmsSelfServiceAccessPayload | undefined>,
    ) {
      state.errorMessage = null;
      state.status = 'loading';
    },
    loadHrmsSelfServiceSucceeded(state, action: PayloadAction<HrmsSelfServiceSnapshot>) {
      state.errorMessage = null;
      state.lastFetchedAt = new Date().toISOString();
      state.selfService = action.payload;
      state.status = 'ready';
    },
    resetHrms(state) {
      state.errorMessage = null;
      state.lastFetchedAt = null;
      state.selfService = createEmptyHrmsSelfServiceSnapshot();
      state.status = 'idle';
    },
  },
});

export const {
  loadHrmsSelfServiceFailed,
  loadHrmsSelfServiceRequested,
  loadHrmsSelfServiceSucceeded,
  resetHrms,
} = hrmsSlice.actions;

export const selectHrmsSelfService = (state: RootState): HrmsSelfServiceSnapshot =>
  state.hrms.selfService;

export const selectHrmsEmployeeProfile = (state: RootState) =>
  state.hrms.selfService.profile;

export const selectHrmsStatus = (state: RootState): HrmsStatus =>
  state.hrms.status;

export const selectHrmsErrorMessage = (state: RootState): string | null =>
  state.hrms.errorMessage;

export const selectHrmsLastFetchedAt = (state: RootState): string | null =>
  state.hrms.lastFetchedAt;

export const hrmsReducer = hrmsSlice.reducer;
