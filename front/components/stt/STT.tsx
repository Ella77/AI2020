import React, { Component, createRef } from "react";
import Head from "next/head";
import { subscription_key } from "../../key";
import { stt_region } from "../../config/api";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import {
  SpeechConfig,
  AudioConfig
} from "microsoft-cognitiveservices-speech-sdk";

type props = {};
type state = {
  text: string;
  isEnd: boolean;
};

class STT extends Component<props, state> {
  textRef: React.RefObject<HTMLTextAreaElement>;
  text: any;
  recognizer: any;
  speechConfig: SpeechConfig;
  audioConfig: AudioConfig;
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      isEnd: false
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
    this.recognizer.recognizeOnceAsync(
      result => {
        console.log(result);
        this.setState(prev => ({
          text: prev.text + result.text
        }));
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

  componentDidMount() {}

  render() {
    return (
      <div>
        <button onClick={this.handle}>handle</button>
        <div id="warning">
          <h1>
            Speech Recognition Speech SDK not found
            (microsoft.cognitiveservices.speech.sdk.bundle.js missing).
          </h1>
          <p>a: {this.state.text}</p>
        </div>
      </div>
    );
  }
}

export default STT;
