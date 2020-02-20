import { all, fork } from "redux-saga/effects";
import user from "./user";
import meeting from "./meeting";

export default function* rootSaga() {
  yield all([fork(user), fork(meeting)]);
}
