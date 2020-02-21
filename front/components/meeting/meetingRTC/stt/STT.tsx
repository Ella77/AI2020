import React, { Component, createRef } from "react";
import Head from "next/head";
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

type props = {
  socket: any;
  meetingId: string;
  currentMeeting: currentMeeting;
};
type state = {
  text: string;
  caption: string;
  sequenceNumberOfCurrentAgenda: number;
  state: number;
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
      state: 0
    };
    this.textRef = createRef();
    this.handle = this.handle.bind(this);
  }

  handle(state) {
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
      this.setState({ state: 1 });
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
    });
    this.props.socket.on("stateChange", data => {
      console.log(data);
      switch (data.type) {
        case 1: {
          this.setState({ state: data.state });
          break;
        }
        case 2: {
          this.setState({
            sequenceNumberOfCurrentAgenda: data.sequenceNumberOfCurrentAgenda
          });
          break;
        }
        case 3: {
          break;
        }
        case 4: {
          break;
        }
      }
    });
    this.setState({
      state: this.props.currentMeeting.state,
      sequenceNumberOfCurrentAgenda: this.props.currentMeeting
        .sequenceNumberOfCurrentAgenda
    });
  }

  MeetingState = state => {
    if (state === 1) {
      return <h1>회의 시작</h1>;
    } else if (state === 2) {
      <h2>회의 종료</h2>;
    }
    return null;
  };

  render() {
    return (
      <div>
        {this.props.currentMeeting.participants.map(participant => {
          <Avatar size={30}>{participant.nickname}</Avatar>;
        })}
        {this.state.state === 1 ? (
          <h1>회의 시작</h1>
        ) : (
          this.state.state === 2 && <h2>회의 종료</h2>
        )}
        {this.props.currentMeeting.agendas.map((agenda, index) => {
          if (index == this.state.sequenceNumberOfCurrentAgenda) {
            return (
              <CurrentAgenda
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
              sequenceNumberOfCurrentAgenda={index}
            />
          );
        })}
        <div id="warning">
          <p>caption: {this.state.caption}</p>
          <p>text:{this.state.text}</p>
        </div>
      </div>
    );
  }
}

export default STT;
