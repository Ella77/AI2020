import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { socket_config } from "../../../config/api";
import AudioP2P from "./webrtc/AudioP2P";
import STT from "./stt/STT";

const MeetingContainer = ({ meetingId }) => {
  const [isNotFirst, setIsNotFirst] = useState(false);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(io(socket_config.server));
    setIsNotFirst(true);
  }, []);
  return (
    <div>
      {isNotFirst && (
        <>
          <AudioP2P socket={socket} />
          <STT socket={socket} meetingId={meetingId} />
        </>
      )}
    </div>
  );
};

export default MeetingContainer;
