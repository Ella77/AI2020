import React from "react";
import AudioP2P from "../components/webrtc/AudioP2P";
import STT from "../components/stt/STT";

const room = () => {
  return (
    <div>
      <AudioP2P />
      <STT />
    </div>
  );
};

export default room;
