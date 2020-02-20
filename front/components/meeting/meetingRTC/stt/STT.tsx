import React, { Component, createRef } from "react";
import Head from "next/head";
import { subscription_key } from "../../../../key";
import { stt_region } from "../../../../config/api";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import {
  SpeechConfig,
  AudioConfig,
  SpeechRecognizer
} from "microsoft-cognitiveservices-speech-sdk";

type props = {};
type state = {
  text: string;
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
      text: ""
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
        }
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

  componentDidMount() {}

  render() {
    return (
      <div>
        <button onClick={this.handle}>handle</button>
        <div id="warning">
          <p>result: {this.state.text}</p>
        </div>
      </div>
    );
  }
}

export default STT;
