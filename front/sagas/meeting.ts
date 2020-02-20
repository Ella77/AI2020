import { all, takeLatest, fork, put, call } from "redux-saga/effects";
import axios from "axios";
import { meetingCreateResponse } from "../utils/meetingDummyData";
import { development_mode } from "../config/env";
import {
  CREATE_MEETING_REQUEST,
  CREATE_MEETING_FAILURE,
  CREATE_MEETING_SUCCESS
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

export default function* meetingSaga() {
  yield all([fork(watchCreateMeeting)]);
}
