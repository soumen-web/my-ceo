import { all } from 'redux-saga/effects';

import { attendanceSaga } from './attendanceSaga';
import { authSaga } from './authSaga';
import { homeSaga } from './homeSaga';
import { hrQuerySaga } from './hrQuerySaga';
import { hrmsSaga } from './hrmsSaga';
import { leaveSaga } from './leaveSaga';
import { myOrganizationSaga } from './myOrganizationSaga';
import { payrollSaga } from './payrollSaga';

export function* rootSaga() {
  yield all([
    attendanceSaga(),
    authSaga(),
    homeSaga(),
    hrQuerySaga(),
    hrmsSaga(),
    leaveSaga(),
    myOrganizationSaga(),
    payrollSaga(),
  ]);
}
