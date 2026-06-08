import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { rootReducer } from './rootReducer';
import { rootSaga } from './sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
  reducer: rootReducer,
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
