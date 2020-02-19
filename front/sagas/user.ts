import { takeLatest, put, call, all, fork } from "redux-saga/effects";
import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
} from "../reducers/user/actions";

function loginAPI() {
  return axios.get("");
}

function* login() {
  try {
    const result = yield call(loginAPI);
    yield put({
      type: LOGIN_SUCCESS,
      data: result
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOGIN_FAILURE,
      data: error
    });
  }
}

function* watchLogin() {
  yield takeLatest(LOGIN_REQUEST, login);
}

export default function* userSaga() {
  yield all([fork(watchLogin)]);
}
