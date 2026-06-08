import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ThemePreference } from '@/design-system/theme/types';

import type { RootState } from '../rootReducer';

interface UiPreferencesState {
  themeMode: ThemePreference;
}

const initialState: UiPreferencesState = {
  themeMode: 'system',
};

const uiPreferencesSlice = createSlice({
  initialState,
  name: 'uiPreferences',
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemePreference>) {
      state.themeMode = action.payload;
    },
  },
});

export const { setThemeMode } = uiPreferencesSlice.actions;
export const selectThemeMode = (state: RootState): ThemePreference =>
  state.uiPreferences.themeMode;

export const uiReducer = uiPreferencesSlice.reducer;
