import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  CreateHrQueryRequest,
  HrQuery,
  HrQuerySnapshot,
} from '@/modules/hr-query/domain/entities/HrQuery';
import { createEmptyHrQuerySnapshot } from '@/modules/hr-query/domain/entities/HrQuery';

import type { RootState } from '../rootReducer';

type HrQueryStatus = 'failed' | 'idle' | 'loading' | 'ready' | 'refreshing';
type HrQuerySubmitStatus = 'failed' | 'idle' | 'loading' | 'ready';

export type CreateHrQueryPayload = CreateHrQueryRequest;

interface HrQueryState {
  errorMessage: string | null;
  lastSubmittedQueryId: string | null;
  selectedQuery: HrQuery | null;
  snapshot: HrQuerySnapshot;
  status: HrQueryStatus;
  submitErrorMessage: string | null;
  submitStatus: HrQuerySubmitStatus;
}

const initialState: HrQueryState = {
  errorMessage: null,
  lastSubmittedQueryId: null,
  selectedQuery: null,
  snapshot: createEmptyHrQuerySnapshot(),
  status: 'idle',
  submitErrorMessage: null,
  submitStatus: 'idle',
};

const hrQuerySlice = createSlice({
  initialState,
  name: 'hrQuery',
  reducers: {
    createHrQueryFailed(state, action: PayloadAction<string>) {
      state.submitErrorMessage = action.payload;
      state.submitStatus = 'failed';
    },
    createHrQueryRequested(state, _action: PayloadAction<CreateHrQueryPayload>) {
      state.lastSubmittedQueryId = null;
      state.submitErrorMessage = null;
      state.submitStatus = 'loading';
    },
    createHrQuerySucceeded(state, action: PayloadAction<HrQuerySnapshot>) {
      state.lastSubmittedQueryId = action.payload.queries[0]?.id ?? null;
      state.selectedQuery = action.payload.queries[0] ?? null;
      state.snapshot = action.payload;
      state.status = 'ready';
      state.submitErrorMessage = null;
      state.submitStatus = 'ready';
    },
    loadHrQueriesFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.status = 'failed';
    },
    loadHrQueriesRequested(state) {
      state.errorMessage = null;
      state.status = 'loading';
    },
    loadHrQueriesSucceeded(state, action: PayloadAction<HrQuerySnapshot>) {
      state.errorMessage = null;
      state.snapshot = action.payload;
      state.status = 'ready';
    },
    refreshHrQueriesFailed(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
      state.status = 'failed';
    },
    refreshHrQueriesRequested(state) {
      state.errorMessage = null;
      state.status = 'refreshing';
    },
    refreshHrQueriesSucceeded(state, action: PayloadAction<HrQuerySnapshot>) {
      state.errorMessage = null;
      state.snapshot = action.payload;
      state.status = 'ready';
    },
    resetHrQuerySubmitState(state) {
      state.lastSubmittedQueryId = null;
      state.submitErrorMessage = null;
      state.submitStatus = 'idle';
    },
    selectHrQuery(state, action: PayloadAction<string | null>) {
      state.selectedQuery = action.payload
        ? state.snapshot.queries.find((query) => query.id === action.payload) ?? null
        : null;
    },
  },
});

export const {
  createHrQueryFailed,
  createHrQueryRequested,
  createHrQuerySucceeded,
  loadHrQueriesFailed,
  loadHrQueriesRequested,
  loadHrQueriesSucceeded,
  refreshHrQueriesFailed,
  refreshHrQueriesRequested,
  refreshHrQueriesSucceeded,
  resetHrQuerySubmitState,
  selectHrQuery,
} = hrQuerySlice.actions;

export const selectHrQuerySnapshot = (state: RootState): HrQuerySnapshot =>
  state.hrQuery.snapshot;

export const selectHrQueryStatus = (state: RootState): HrQueryStatus =>
  state.hrQuery.status;

export const selectHrQueryErrorMessage = (state: RootState): string | null =>
  state.hrQuery.errorMessage;

export const selectHrQuerySubmitStatus = (state: RootState): HrQuerySubmitStatus =>
  state.hrQuery.submitStatus;

export const selectHrQuerySubmitErrorMessage = (state: RootState): string | null =>
  state.hrQuery.submitErrorMessage;

export const selectLastSubmittedHrQueryId = (state: RootState): string | null =>
  state.hrQuery.lastSubmittedQueryId;

export const selectSelectedHrQuery = (state: RootState): HrQuery | null =>
  state.hrQuery.selectedQuery;

export const hrQueryReducer = hrQuerySlice.reducer;
