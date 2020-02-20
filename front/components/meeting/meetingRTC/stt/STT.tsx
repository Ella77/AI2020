import React, { Component, createRef } from "react";
import Head from "next/head";
import { subscription_key } from "../../../../key";
import { stt_region } from "../../../../config/api";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import axios from "axios";
import { withRouter, NextRouter } from "next/router";
import {
  SpeechConfig,
  AudioConfig,
  SpeechRecognizer
} from "microsoft-cognitiveservices-speech-sdk";
import { getCookie } from "../../../../utils/utilFunction";

type props = {
  socket: any;
  meetingId: string;
};
type state = {
  text: string;
  caption: string;
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
      caption: ""
    };
    this.textRef = createRef();
    this.handle = this.handle.bind(this);
  }

  handle() {
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
        this.handle();
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
      if (data.success) {
        this.props.socket.emit("getOnlineUser");
      }
    });
    this.props.socket.on("getOnlineUser", data => {
      console.log("getOnlineUser", data);
    });

    this.props.socket.on("talk", data => {
      console.log("talk", data);
      this.setState({ caption: data.talking });
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.handle}>handle</button>
        <div id="warning">
          <p>result: {this.state.text}</p>
          <p>caption: {this.state.caption}</p>
        </div>
      </div>
    );
  }
}

export default STT;
