import React, { Component, createRef } from "react";
import { subscription_key } from "../../../../key";
import { stt_region } from "../../../../config/api";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import axios from "axios";
import {
  SpeechConfig,
  AudioConfig,
  SpeechRecognizer
} from "microsoft-cognitiveservices-speech-sdk";
import { getCookie } from "../../../../utils/utilFunction";
import { currentMeeting } from "../../../../reducers/meeting/interfaces";
import { Avatar } from "antd";
import CurrentAgenda from "./CurrentAgenda";
import OtherAgenda from "./OtherAgenda";
import styled from "styled-components";
import Router from "next/router";

type props = {
  socket: any;
  meetingId: string;
  currentMeeting: currentMeeting;
  handleCallP2P: Function;
};
type state = {
  text: string;
  caption: string;
  sequenceNumberOfCurrentAgenda: number;
  state: number;
  participants: any;
  meetingState: number;
};

class STT extends Component<props, state> {
  textRef: React.RefObject<HTMLTextAreaElement>;
  text: any;
  recognizer: SpeechRecognizer;
  speechConfig: SpeechConfig;
  audioConfig: AudioConfig;
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      caption: "",
      sequenceNumberOfCurrentAgenda: 0,
      state: 0,
      meetingState: 1,
      participants: []
    };
    this.textRef = createRef();
    this.handle = this.handle.bind(this);
  }

  handle(state) {
    console.log("handle", state);
    if (state !== 2) {
      this.speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        subscription_key,
        stt_region
      );
      this.audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      this.speechConfig.speechRecognitionLanguage = "en-US";
      this.recognizer = new SpeechSDK.SpeechRecognizer(
        this.speechConfig,
        this.audioConfig
      );
      this.recognizer.speechStartDetected = (sender, e) => {
        console.log("e", e);
        console.log("sender", sender);
      };
      this.recognizer.recognizeOnceAsync(
        result => {
          console.log(result);
          if (result.text) {
            this.setState({ text: result.text });
            this.props.socket.emit("talk", {
              talking: this.state.text
            });
          }
          this.recognizer.close();
          this.handle(1);
        },
        err => {
          console.log(err);
          this.setState(prev => ({
            text: prev.text + err
          }));
          this.recognizer.close();
        }
      );
    } else {
      this.recognizer.close();
    }
  }
  _onPressAgenda = () => {
    if (this.state.state == 0) {
      this.setState({ state: 1 });
      axios.put(`/meetings/${this.props.meetingId}/agenda-sequence`, {
        sequenceNumber: this.state.sequenceNumberOfCurrentAgenda
      });
      this.handle(1);
    } else if (this.state.state == 1) {
      this.setState({ state: 2 });
      axios.put(`/meetings/${this.props.meetingId}/agenda-sequence`, {
        sequenceNumber: this.state.sequenceNumberOfCurrentAgenda + 1
      });
      this.handle(2);
    } else {
      this.setState({ state: 0 });
    }
  };
  componentDidMount() {
    // enter the room
    // REST API
    axios.post(
      `/meetings/${this.props.meetingId}/enter`,
      {},
      { withCredentials: true }
    );
    // SOCKET ENTER
    this.props.socket.emit("enter", {
      meetingId: this.props.meetingId,
      loginToken: getCookie("X-Login-Token")
    });

    // add eventlistener
    this.props.socket.on("enter", data => {
      console.log("enter is success ? ", data);
    });

    this.props.socket.on("talk", data => {
      console.log("talk", data);
      this.setState({ caption: data.talking });
      this.setState({ state: 1 });
    });
    this.props.socket.on("stateChange", data => {
      console.log(data);
      switch (data.type) {
        case 1: {
          this.setState({ meetingState: data.state });
          break;
        }
        case 2: {
          this.setState(prev => ({
            sequenceNumberOfCurrentAgenda: data.sequenceNumberOfCurrentAgenda,
            state: 0
          }));

          break;
        }
        case 3: {
          this.props.handleCallP2P();
          break;
        }
        case 4: {
          break;
        }
      }
    });
    this.setState({
      meetingState: this.props.currentMeeting.state,
      sequenceNumberOfCurrentAgenda: this.props.currentMeeting
        .sequenceNumberOfCurrentAgenda,
      participants: this.props.currentMeeting.participants
    });
  }

  render() {
    return (
      <div>
        {this.props.currentMeeting.agendas.map((agenda, index) => {
          if (
            index == this.state.sequenceNumberOfCurrentAgenda ||
            this.state.meetingState === 2
          ) {
            return (
              <CurrentAgenda
                state={this.state.state}
                key={agenda.id}
                agenda={agenda}
                onPress={this._onPressAgenda}
              />
            );
          }
          return (
            <OtherAgenda
              key={agenda.id}
              agenda={agenda}
              index={index}
              sequenceNumberOfCurrentAgenda={
                this.state.sequenceNumberOfCurrentAgenda
              }
            />
          );
        })}
        {this.state.meetingState === 2 && (
          <EndAlarm>
            회의 종료
            <div
              onClick={() => {
                Router.replace(`meeting/detail/${this.props.meetingId}`);
              }}
            >
              <p>회의 상세페이지로 이동</p>
            </div>
          </EndAlarm>
        )}
        <AvatarDiv>
          {this.state.participants.map(participant => (
            <Avatar
              style={{ marginBottom: 20, marginRight: 10 }}
              key={participant._id}
              size={100}
            >
              {participant.nickname}
            </Avatar>
          ))}
        </AvatarDiv>
        <CaptionDiv id="warning">
          <p>caption: {this.state.caption}</p>
        </CaptionDiv>
      </div>
    );
  }
}

const EndAlarm = styled.h1`
  text-align: center;
  font-size: 50px;
  color: white;
`;

const AvatarDiv = styled.div`
  position: absolute;
  bottom: 100px;
  right: 0;
  display: inline-block;
`;

const CaptionDiv = styled.div`
  position: absolute;
  bottom: 50px;
  left: 0;
  width: 100%;
  opacity: 0.7;
  background-color: #000000;
  p {
    color: white;
    text-align: center;
    font-size: 15px;
  }
`;

export default STT;
