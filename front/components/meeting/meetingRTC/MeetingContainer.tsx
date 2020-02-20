import React, { Component } from "react";
import STT from "./stt/STT";
import AudioP2P from "./webrtc/AudioP2P";

class MeetingContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <AudioP2P />
        <STT />
      </div>
    );
  }
}

export default MeetingContainer;
