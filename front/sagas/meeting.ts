import { all, takeLatest, fork, put, call } from "redux-saga/effects";
import axios from "axios";
import { meetingCreateResponse } from "../utils/meetingDummyData";
import { development_mode } from "../config/env";
import {
  CREATE_MEETING_REQUEST,
  CREATE_MEETING_FAILURE,
  CREATE_MEETING_SUCCESS,
  GET_MEETINGS_SUCCESS,
  GET_MEETINGS_FAILURE,
  GET_MEETINGS_REQUEST,
  GET_MY_MEETINGS_REQUEST,
  GET_MY_MEETINGS_FAILURE,
  GET_MY_MEETINGS_SUCCESS,
  GET_MEETING_REQUEST,
  GET_MEETING_SUCCESS,
  GET_MEETING_FAILURE
} from "../reducers/meeting/actions";

function createMeetingAPI(data) {
  console.log(data);
  let postData = {
    name: data.name,
    agendas: data.currentAgendas.map(agenda => ({
      name: agenda.name,
      expectedTime: agenda.expectedTime
    }))
  };
  console.log(postData);

  return axios.post("/meetings", postData, {
    withCredentials: true
  });
}

function* createMeeting(action) {
  try {
    console.log(action);
    const result =
      development_mode !== "development"
        ? yield call(createMeetingAPI, action.payload)
        : meetingCreateResponse;

    yield put({
      type: CREATE_MEETING_SUCCESS,
      result: result.data.meeting
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: CREATE_MEETING_FAILURE,
      error: error
    });
  }
}

function* watchCreateMeeting() {
  yield takeLatest(CREATE_MEETING_REQUEST, createMeeting);
}

function getMeetingsAPI(data) {
  return axios.get(`/meetings?page=${data.page}&perpage=5`);
}

function* getMeetings(action) {
  try {
    const result = yield call(getMeetingsAPI, action.payload);
    yield put({
      type: GET_MEETINGS_SUCCESS,
      result: {
        result: result.data.result,
        lastPage: result.data.lastPage
      }
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: GET_MEETINGS_FAILURE
    });
  }
}

function* watchGetMeetings() {
  yield takeLatest(GET_MEETINGS_REQUEST, getMeetings);
}

function getMyMeetingsAPI() {
  return axios.get(`/users/self/meetings`, {
    withCredentials: true
  });
}

function* getMyMeetings() {
  try {
    const result = yield call(getMyMeetingsAPI);
    yield put({
      type: GET_MY_MEETINGS_SUCCESS,
      result: result.data.result
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: GET_MY_MEETINGS_FAILURE
    });
  }
}

function* watchGetMyMeetings() {
  yield takeLatest(GET_MY_MEETINGS_REQUEST, getMyMeetings);
}

function getMeetingAPI(data) {
  return axios.get(`/meetings/${data}`, {
    withCredentials: true
  });
}

function* getMeeting(action) {
  try {
    const result = yield call(getMeetingAPI, action.payload);
    yield put({
      type: GET_MEETING_SUCCESS,
      result: result.data.result
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: GET_MEETING_FAILURE
    });
  }
}

function* watchGetMeeting() {
  yield takeLatest(GET_MEETING_REQUEST, getMeeting);
}

export default function* meetingSaga() {
  yield all([
    fork(watchCreateMeeting),
    fork(watchGetMeetings),
    fork(watchGetMyMeetings),
    fork(watchGetMeeting)
  ]);
}
