import React from "react";
import { useSelector } from "react-redux";
import { store } from "../../reducers/indext.type";
import AudioP2P from "../../components/webrtc/AudioP2P";
import STT from "../../components/stt/STT";

const MeetingID = () => {
  const { currentAgendas, currentMeeting } = useSelector(
    (state: store) => state.meeting.meeting
  );

  return (
    <div>
      <AudioP2P />
      <STT />
    </div>
  );
};

export default MeetingID;
