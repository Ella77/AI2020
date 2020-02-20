import { takeLatest, put, call, all, fork } from "redux-saga/effects";
import axios from "axios";
import { signUpLoginResponse } from "../utils/userDummyData";
import { development_mode } from "../config/env";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_FAILURE,
  LOAD_USER_SUCCESS
} from "../reducers/user/actions";

function signUpAPI(data) {
  return axios.post("/auth/sign-up", data, { withCredentials: true });
}

function* signUp(action) {
  try {
    const result =
      development_mode !== "development"
        ? yield call(signUpAPI, action.payload)
        : signUpLoginResponse;

    yield put({
      type: SIGN_UP_SUCCESS,
      result: result.data
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: SIGN_UP_FAILURE,
      errorCode: error
    });
  }
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function loginAPI(data) {
  return axios.post("/auth/sign-in", data, { withCredentials: true });
}

function* login(action) {
  try {
    const result =
      development_mode !== "development"
        ? yield call(loginAPI, action.payload)
        : signUpLoginResponse;
    yield put({
      type: LOGIN_SUCCESS,
      result: result.data
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

function* loadUser() {
  try {
    let user = yield localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      yield put({
        type: LOAD_USER_SUCCESS,
        result: {
          user
        }
      });
    } else {
      yield put({
        type: LOAD_USER_FAILURE
      });
    }
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_USER_FAILURE,
      data: error
    });
  }
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchSignUp), fork(watchLoadUser)]);
}
