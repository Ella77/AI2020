import React from "react";
import { GET_MEETING_REQUEST } from "../../../reducers/meeting/actions";

const meetingID = () => {
  return <div></div>;
};

export default meetingID;

meetingID.getInitialProps = ctx => {
  ctx.store.dispatch({
    type: GET_MEETING_REQUEST,
    payload: ctx.query.meetingID
  });
};
