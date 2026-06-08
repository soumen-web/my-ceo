import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../rootReducer';

interface DeviceState {
  deviceToken: string | null;
}

const initialState: DeviceState = {
  deviceToken: null,
};

const deviceSlice = createSlice({
  initialState,
  name: 'device',
  reducers: {
    clearDeviceToken(state) {
      state.deviceToken = null;
    },
    setDeviceToken(state, action: PayloadAction<string>) {
      state.deviceToken = action.payload;
    },
  },
});

export const { clearDeviceToken, setDeviceToken } = deviceSlice.actions;
export const selectDeviceToken = (state: RootState): string | null =>
  state.device.deviceToken;

export const deviceReducer = deviceSlice.reducer;
