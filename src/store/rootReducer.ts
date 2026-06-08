import { combineReducers } from '@reduxjs/toolkit';

import { attendanceReducer } from './slices/attendanceSlice';
import { authReducer } from './slices/authSlice';
import { deviceReducer } from './slices/deviceSlice';
import { homeReducer } from './slices/homeSlice';
import { hrQueryReducer } from './slices/hrQuerySlice';
import { hrmsReducer } from './slices/hrmsSlice';
import { leaveReducer } from './slices/leaveSlice';
import { myOrganizationReducer } from './slices/myOrganizationSlice';
import { payrollReducer } from './slices/payrollSlice';
import { uiReducer } from './slices/uiSlice';

export const rootReducer = combineReducers({
  attendance: attendanceReducer,
  auth: authReducer,
  device: deviceReducer,
  home: homeReducer,
  hrQuery: hrQueryReducer,
  hrms: hrmsReducer,
  leave: leaveReducer,
  myOrganization: myOrganizationReducer,
  payroll: payrollReducer,
  uiPreferences: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
