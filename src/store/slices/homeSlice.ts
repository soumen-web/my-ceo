import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  createEmptyHomeDashboard,
  type HomeDashboard,
} from '@/modules/home/domain/entities/HomeDashboard';

import type { RootState } from '../rootReducer';

interface HomeState {
  dashboard: HomeDashboard;
  errorMessage: string | null;
  status: 'failed' | 'idle' | 'loading' | 'ready';
}

const initialState: HomeState = {
  dashboard: createEmptyHomeDashboard(),
  errorMessage: null,
  status: 'idle',
};

const homeSlice = createSlice({
  initialState,
  name: 'home',
  reducers: {
    loadHomeDashboardFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.status = 'failed';
    },
    loadHomeDashboardRequested(state) {
      state.errorMessage = null;
      state.status = 'loading';
    },
    loadHomeDashboardSucceeded(state, action: PayloadAction<HomeDashboard>) {
      state.dashboard = action.payload;
      state.errorMessage = null;
      state.status = 'ready';
    },
    resetHomeDashboard(state) {
      state.dashboard = createEmptyHomeDashboard();
      state.errorMessage = null;
      state.status = 'idle';
    },
    setHomeDashboard(state, action: PayloadAction<HomeDashboard>) {
      state.dashboard = action.payload;
      state.errorMessage = null;
      state.status = 'ready';
    },
  },
});

export const {
  loadHomeDashboardFailed,
  loadHomeDashboardRequested,
  loadHomeDashboardSucceeded,
  resetHomeDashboard,
  setHomeDashboard,
} = homeSlice.actions;

export const selectHomeState = (state: RootState): HomeState => state.home;
export const selectHomeDashboard = (state: RootState): HomeDashboard =>
  state.home.dashboard;
export const selectHomeStatus = (state: RootState): HomeState['status'] =>
  state.home.status;
export const selectHomeErrorMessage = (state: RootState): string | null =>
  state.home.errorMessage;
export const selectHomeEmployeeAvatarUrl = (state: RootState): string =>
  state.home.dashboard.employee.avatarUrl;
export const selectHomeEmployeeRole = (state: RootState): string =>
  state.home.dashboard.employee.role;

export const homeReducer = homeSlice.reducer;
