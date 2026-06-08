import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  createEmptyOrganizationInfo,
  type OrganizationInfo,
} from '@/modules/my-organization/domain/entities/OrganizationInfo';
import type { MyOrganizationProfile } from '@/modules/my-organization/domain/entities/MyOrganizationProfile';
import {
  createEmptyReportingManagerInfo,
  type ReportingManagerInfo,
} from '@/modules/my-organization/domain/entities/ReportingManagerInfo';
import {
  createEmptyTeamInfo,
  type TeamInfo,
} from '@/modules/my-organization/domain/entities/TeamInfo';
import {
  createEmptyWorkLocationInfo,
  type WorkLocationInfo,
} from '@/modules/my-organization/domain/entities/WorkLocationInfo';
import {
  createEmptyWorkModeInfo,
  type WorkModeInfo,
} from '@/modules/my-organization/domain/entities/WorkModeInfo';

import type { RootState } from '../rootReducer';

interface MyOrganizationState {
  organizationInfo: OrganizationInfo;
  organizationInfoErrorMessage: string | null;
  organizationInfoStatus: 'failed' | 'idle' | 'loading' | 'ready';
  myTeam: TeamInfo;
  myTeamErrorMessage: string | null;
  myTeamStatus: 'failed' | 'idle' | 'loading' | 'ready';
  reportingManager: ReportingManagerInfo;
  reportingManagerErrorMessage: string | null;
  reportingManagerStatus: 'failed' | 'idle' | 'loading' | 'ready';
  workLocation: WorkLocationInfo;
  workLocationErrorMessage: string | null;
  workLocationStatus: 'failed' | 'idle' | 'loading' | 'ready';
  workMode: WorkModeInfo;
  workModeErrorMessage: string | null;
  workModeStatus: 'failed' | 'idle' | 'loading' | 'ready';
}

const initialState: MyOrganizationState = {
  organizationInfo: createEmptyOrganizationInfo(),
  organizationInfoErrorMessage: null,
  organizationInfoStatus: 'idle',
  myTeam: createEmptyTeamInfo(),
  myTeamErrorMessage: null,
  myTeamStatus: 'idle',
  reportingManager: createEmptyReportingManagerInfo(),
  reportingManagerErrorMessage: null,
  reportingManagerStatus: 'idle',
  workLocation: createEmptyWorkLocationInfo(),
  workLocationErrorMessage: null,
  workLocationStatus: 'idle',
  workMode: createEmptyWorkModeInfo(),
  workModeErrorMessage: null,
  workModeStatus: 'idle',
};

const myOrganizationSlice = createSlice({
  initialState,
  name: 'myOrganization',
  reducers: {
    loadMyOrganizationFailed(state, action: PayloadAction<string>) {
      state.organizationInfoErrorMessage = action.payload;
      state.organizationInfoStatus = 'failed';
      state.myTeamErrorMessage = action.payload;
      state.myTeamStatus = 'failed';
      state.reportingManagerErrorMessage = action.payload;
      state.reportingManagerStatus = 'failed';
      state.workLocationErrorMessage = action.payload;
      state.workLocationStatus = 'failed';
      state.workModeErrorMessage = action.payload;
      state.workModeStatus = 'failed';
    },
    loadMyOrganizationRequested(state) {
      state.organizationInfoErrorMessage = null;
      state.organizationInfoStatus = 'loading';
      state.myTeamErrorMessage = null;
      state.myTeamStatus = 'loading';
      state.reportingManagerErrorMessage = null;
      state.reportingManagerStatus = 'loading';
      state.workLocationErrorMessage = null;
      state.workLocationStatus = 'loading';
      state.workModeErrorMessage = null;
      state.workModeStatus = 'loading';
    },
    loadMyOrganizationSucceeded(state, action: PayloadAction<MyOrganizationProfile>) {
      state.organizationInfo = action.payload.organizationInfo;
      state.organizationInfoErrorMessage = null;
      state.organizationInfoStatus = 'ready';
      state.myTeam = action.payload.team;
      state.myTeamErrorMessage = null;
      state.myTeamStatus = 'ready';
      state.reportingManager = action.payload.reportingManager;
      state.reportingManagerErrorMessage = null;
      state.reportingManagerStatus = 'ready';
      state.workLocation = action.payload.workLocation;
      state.workLocationErrorMessage = null;
      state.workLocationStatus = 'ready';
      state.workMode = action.payload.workMode;
      state.workModeErrorMessage = null;
      state.workModeStatus = 'ready';
    },
    loadOrganizationInfoFailed(state, action: PayloadAction<string>) {
      state.organizationInfoErrorMessage = action.payload;
      state.organizationInfoStatus = 'failed';
    },
    loadOrganizationInfoRequested(state) {
      state.organizationInfoErrorMessage = null;
      state.organizationInfoStatus = 'loading';
    },
    loadOrganizationInfoSucceeded(state, action: PayloadAction<OrganizationInfo>) {
      state.organizationInfo = action.payload;
      state.organizationInfoErrorMessage = null;
      state.organizationInfoStatus = 'ready';
    },
    loadMyTeamFailed(state, action: PayloadAction<string>) {
      state.myTeamErrorMessage = action.payload;
      state.myTeamStatus = 'failed';
    },
    loadMyTeamRequested(state) {
      state.myTeamErrorMessage = null;
      state.myTeamStatus = 'loading';
    },
    loadMyTeamSucceeded(state, action: PayloadAction<TeamInfo>) {
      state.myTeam = action.payload;
      state.myTeamErrorMessage = null;
      state.myTeamStatus = 'ready';
    },
    loadReportingManagerFailed(state, action: PayloadAction<string>) {
      state.reportingManagerErrorMessage = action.payload;
      state.reportingManagerStatus = 'failed';
    },
    loadReportingManagerRequested(state) {
      state.reportingManagerErrorMessage = null;
      state.reportingManagerStatus = 'loading';
    },
    loadReportingManagerSucceeded(state, action: PayloadAction<ReportingManagerInfo>) {
      state.reportingManager = action.payload;
      state.reportingManagerErrorMessage = null;
      state.reportingManagerStatus = 'ready';
    },
    loadWorkLocationFailed(state, action: PayloadAction<string>) {
      state.workLocationErrorMessage = action.payload;
      state.workLocationStatus = 'failed';
    },
    loadWorkLocationRequested(state) {
      state.workLocationErrorMessage = null;
      state.workLocationStatus = 'loading';
    },
    loadWorkLocationSucceeded(state, action: PayloadAction<WorkLocationInfo>) {
      state.workLocation = action.payload;
      state.workLocationErrorMessage = null;
      state.workLocationStatus = 'ready';
    },
    loadWorkModeFailed(state, action: PayloadAction<string>) {
      state.workModeErrorMessage = action.payload;
      state.workModeStatus = 'failed';
    },
    loadWorkModeRequested(state) {
      state.workModeErrorMessage = null;
      state.workModeStatus = 'loading';
    },
    loadWorkModeSucceeded(state, action: PayloadAction<WorkModeInfo>) {
      state.workMode = action.payload;
      state.workModeErrorMessage = null;
      state.workModeStatus = 'ready';
    },
    resetMyOrganization(state) {
      state.organizationInfo = createEmptyOrganizationInfo();
      state.organizationInfoErrorMessage = null;
      state.organizationInfoStatus = 'idle';
      state.myTeam = createEmptyTeamInfo();
      state.myTeamErrorMessage = null;
      state.myTeamStatus = 'idle';
      state.reportingManager = createEmptyReportingManagerInfo();
      state.reportingManagerErrorMessage = null;
      state.reportingManagerStatus = 'idle';
      state.workLocation = createEmptyWorkLocationInfo();
      state.workLocationErrorMessage = null;
      state.workLocationStatus = 'idle';
      state.workMode = createEmptyWorkModeInfo();
      state.workModeErrorMessage = null;
      state.workModeStatus = 'idle';
    },
  },
});

export const {
  loadMyOrganizationFailed,
  loadMyOrganizationRequested,
  loadMyOrganizationSucceeded,
  loadOrganizationInfoFailed,
  loadOrganizationInfoRequested,
  loadOrganizationInfoSucceeded,
  loadMyTeamFailed,
  loadMyTeamRequested,
  loadMyTeamSucceeded,
  loadReportingManagerFailed,
  loadReportingManagerRequested,
  loadReportingManagerSucceeded,
  loadWorkLocationFailed,
  loadWorkLocationRequested,
  loadWorkLocationSucceeded,
  loadWorkModeFailed,
  loadWorkModeRequested,
  loadWorkModeSucceeded,
  resetMyOrganization,
} = myOrganizationSlice.actions;

export const selectOrganizationInfo = (state: RootState): OrganizationInfo =>
  state.myOrganization.organizationInfo;
export const selectOrganizationInfoStatus = (
  state: RootState,
): MyOrganizationState['organizationInfoStatus'] =>
  state.myOrganization.organizationInfoStatus;
export const selectOrganizationInfoErrorMessage = (state: RootState): string | null =>
  state.myOrganization.organizationInfoErrorMessage;
export const selectMyTeam = (state: RootState): TeamInfo =>
  state.myOrganization.myTeam;
export const selectMyTeamStatus = (
  state: RootState,
): MyOrganizationState['myTeamStatus'] => state.myOrganization.myTeamStatus;
export const selectMyTeamErrorMessage = (state: RootState): string | null =>
  state.myOrganization.myTeamErrorMessage;
export const selectReportingManager = (state: RootState): ReportingManagerInfo =>
  state.myOrganization.reportingManager;
export const selectReportingManagerStatus = (
  state: RootState,
): MyOrganizationState['reportingManagerStatus'] =>
  state.myOrganization.reportingManagerStatus;
export const selectReportingManagerErrorMessage = (state: RootState): string | null =>
  state.myOrganization.reportingManagerErrorMessage;
export const selectWorkLocation = (state: RootState): WorkLocationInfo =>
  state.myOrganization.workLocation;
export const selectWorkLocationStatus = (
  state: RootState,
): MyOrganizationState['workLocationStatus'] =>
  state.myOrganization.workLocationStatus;
export const selectWorkLocationErrorMessage = (state: RootState): string | null =>
  state.myOrganization.workLocationErrorMessage;
export const selectWorkMode = (state: RootState): WorkModeInfo =>
  state.myOrganization.workMode;
export const selectWorkModeStatus = (
  state: RootState,
): MyOrganizationState['workModeStatus'] => state.myOrganization.workModeStatus;
export const selectWorkModeErrorMessage = (state: RootState): string | null =>
  state.myOrganization.workModeErrorMessage;

export const myOrganizationReducer = myOrganizationSlice.reducer;
