import { all } from 'redux-saga/effects';

import AuthSaga from './auth/login/saga';

import DataSaga from './data/saga';

export default function* rootSaga() {
  yield all([
    AuthSaga(),
    DataSaga()
  ])
}