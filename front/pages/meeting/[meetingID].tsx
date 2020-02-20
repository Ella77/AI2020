import React from "react";
import { useSelector } from "react-redux";
import { store } from "../../reducers/indext.type";
import MeetingContainer from "../../components/meeting/meetingRTC/MeetingContainer";

const MeetingID = () => {
  const { currentAgendas, currentMeeting } = useSelector(
    (state: store) => state.meeting.meeting
  );

  return (
    <div>
      <MeetingContainer />
    </div>
  );
};

export default MeetingID;
