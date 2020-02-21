import React, { Component, createRef } from "react";
import { withAlert } from "react-alert";
import {
  getUserMediaContraints,
  RTCPeerConnectionConfig,
  offerAndAnswerOptions
} from "../../../../config/webrtc";

type Props = { alert: any; socket: any };
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
      this.props.alert.show("answer the call");
      console.log("answer");
      this.pc.createAnswer(offerAndAnswerOptions).then(sdp => {
        // console.log(JSON.stringify(sdp))
        // set answer sdp as local description
        this.pc.setLocalDescription(sdp);
        this.sendToPeer("answer", sdp);
      });
    });
    this.props.socket.on("answer", sdp => {
      this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
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
      if (e.streams && e.streams[0]) {
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
    this.props.alert.info("calling start");

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
      <div>
        <video id="local-video" ref={this.localVideoRef} autoPlay playsInline />
        <video
          id="remote-video"
          style={{
            width: 100,
            height: 100,
            marginLeft: 10,
            backgroundColor: "black"
          }}
          ref={this.remoteVideoRef}
          autoPlay
          playsInline
        />
        <button
          onClick={this._onCallButton}
          disabled={this.state.isCallDisable}
        >
          콜 하기
        </button>
      </div>
    );
  }
}

export default withAlert()(Audio);
