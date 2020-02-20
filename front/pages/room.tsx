import React, { useEffect } from "react";
import AudioP2P from "../components/webrtc/AudioP2P";
import STT from "../components/stt/STT";
import { useDispatch } from "react-redux";
import { LOAD_USER_REQUEST } from "../reducers/user/actions";

const room = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST
    });
  }, []);
  return (
    <div>
      <AudioP2P />
      <STT />
    </div>
  );
};

export default room;
