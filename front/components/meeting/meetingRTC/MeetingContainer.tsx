import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { socket_config } from "../../../config/api";
import AudioP2P from "./webrtc/AudioP2P";
import STT from "./stt/STT";
import { useSelector } from "react-redux";
import { store } from "../../../reducers/indext.type";
import { useRouter } from "next/router";

const MeetingContainer = ({ meetingId }) => {
  const [isNotFirst, setIsNotFirst] = useState(false);
  const [socket, setSocket] = useState(null);
  const { currentMeeting } = useSelector(
    (state: store) => state.meeting.meeting
  );
  const router = useRouter();
  useEffect(() => {
    if (currentMeeting.state == 2) {
      router.push(`/meeting/detail/${meetingId}`);
    } else {
      setSocket(io(socket_config.server));
      setIsNotFirst(true);
    }
  }, []);
  return (
    <div>
      <p></p>
      {isNotFirst && (
        <>
          <AudioP2P
            socket={socket}
            currentMeeting={currentMeeting}
            meetingId={meetingId}
          />
        </>
      )}
    </div>
  );
};

export default MeetingContainer;
