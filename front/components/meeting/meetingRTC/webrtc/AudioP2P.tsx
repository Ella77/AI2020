import React, { Component, createRef } from "react";
import { withAlert } from "react-alert";
import {
  getUserMediaContraints,
  RTCPeerConnectionConfig,
  offerAndAnswerOptions
} from "../../../../config/webrtc";
import { currentMeeting } from "../../../../reducers/meeting/interfaces";
import { Avatar } from "antd";
import STT from "../stt/STT";
import { connect } from "react-redux";
import { GET_MEETING_REQUEST } from "../../../../reducers/meeting/actions";

type Props = {
  socket: any;
  currentMeeting: currentMeeting;
  meetingId: string;
  getCurrentMeeting: Function;
};
type States = { isCallDisable: boolean; connectionSuccess: boolean };
class Audio extends Component<Props, States> {
  //types
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  pc: RTCPeerConnection;
  socket: any;

  constructor(props) {
    super(props);
    this.state = {
      isCallDisable: false,
      connectionSuccess: false
    };
    this.localVideoRef = createRef();
    this.remoteVideoRef = createRef();
  }

  // handling peerconnection
  handlePeerConnection() {
    this.props.socket.on("connection-success", success => {
      console.log(success);
    });

    this.props.socket.on("offer", sdp => {
      this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
      console.log("answer");
      this.pc.createAnswer(offerAndAnswerOptions).then(sdp => {
        // console.log(JSON.stringify(sdp))
        // set answer sdp as local description
        this.pc.setLocalDescription(sdp);
        this.props.getCurrentMeeting(this.props.meetingId);
        this.sendToPeer("answer", sdp);
      });
    });
    this.props.socket.on("answer", sdp => {
      this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
      this.props.getCurrentMeeting(this.props.meetingId);
    });

    this.props.socket.on("candidate", candidate => {
      console.log("add ice");
      this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    // add rtcpeerconnection events
    this.pc = new RTCPeerConnection(RTCPeerConnectionConfig);
    this.pc.onicecandidate = e => {
      if (e.candidate) {
        this.sendToPeer("candidate", e.candidate);
      }
    };
    this.pc.onconnectionstatechange = e => {
      console.log("onconnectionstatechange", e);
    };
    this.pc.ontrack = e => {
      console.log("ontrack", e.streams[0]);
      if (e.streams && e.streams[0] && this.remoteVideoRef && e.streams[0]) {
        this.remoteVideoRef.current.srcObject = e.streams[0];
      }
    };
  }

  componentDidMount() {
    this.handlePeerConnection();

    navigator.mediaDevices
      .getUserMedia(getUserMediaContraints)
      .then((mediaStream: MediaStream) => {
        this.localVideoRef.current.srcObject = mediaStream;
        mediaStream.getAudioTracks().map(track => {
          this.pc.addTrack(track, mediaStream);
        });
      });
  }

  _onCallButton = () => {
    // alert message

    this.setState({ isCallDisable: true });
    console.log("offer");
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
    // initiates the creation of SDP
    this.pc.createOffer(offerAndAnswerOptions).then(sdp => {
      // console.log(JSON.stringify(sdp))
      // set offer sdp as local description
      this.pc.setLocalDescription(sdp);
      this.sendToPeer("offer", sdp);
    });
  };

  sendToPeer = (messageType, payload) => {
    this.props.socket.emit(messageType, {
      socketID: this.props.socket.id,
      payload
    });
  };

  render() {
    return (
      <>
        <video
          style={{ width: 0 }}
          id="local-video"
          ref={this.localVideoRef}
          autoPlay
          playsInline
        />
        <video
          style={{ width: 0 }}
          id="remote-video"
          ref={this.remoteVideoRef}
          autoPlay
          playsInline
        />
        <STT
          socket={this.props.socket}
          currentMeeting={this.props.currentMeeting}
          meetingId={this.props.meetingId}
          handleCallP2P={this._onCallButton}
        />
      </>
    );
  }
}

const mapDispatchTopProps = dispatch => {
  return {
    getCurrentMeeting: meetingId =>
      dispatch({ type: GET_MEETING_REQUEST, payload: meetingId })
  };
};

export default connect(state => ({ state }), mapDispatchTopProps)(Audio);
