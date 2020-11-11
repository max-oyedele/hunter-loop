import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

import { LOGIN_USER, LOGOUT_USER, FORGET_PASSWORD } from './actionTypes';
import { loginSuccess, logoutUserSuccess, apiError } from './actions';

import { getFirebaseBackend } from '../../../helpers/firebase_helper';
import { getFirestoreBackend } from '../../../helpers/firestore_helper';

const fireBaseBackend = getFirebaseBackend();
const fireStoreBackend = getFirestoreBackend();

function* loginUser({ payload: { user, history } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.loginUser, user.email, user.password);      
      const registeredUser = yield call(fireStoreBackend.getUser, response.uid);
      localStorage.setItem("authUser", JSON.stringify(registeredUser));
      yield put(loginSuccess(registeredUser));
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {

    } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {

    }
    // history.push('/');
  } catch (error) {    
    yield put(apiError(error));
  }
}

function* forgetPassword({payload: {email}}){
  try{
    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      const response = yield call(fireBaseBackend.forgetPassword, email);            
    }
  }
  catch(error){
    yield put(apiError(error));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");

    if (process.env.REACT_APP_DEFAULTAUTH === 'firebase') {
      const response = yield call(fireBaseBackend.logout);      
      yield put(logoutUserSuccess(response));
    }
    // history.push('/login');
  } catch (error) {
    yield put(apiError(error));
  }
}

export function* watchUserLogin() {
  yield takeEvery(LOGIN_USER, loginUser)
}

export function* watchForgetPassword(){
  yield takeEvery(FORGET_PASSWORD, forgetPassword)
}

export function* watchUserLogout() {
  yield takeEvery(LOGOUT_USER, logoutUser)
}

function* loginSaga() {
  yield all([
    fork(watchUserLogin),
    fork(watchUserLogout),
    fork(watchForgetPassword)
  ]);
}

export default loginSaga;