import React, { Component, createRef } from "react";
import Head from "next/head";
import { subscription_key } from "../../key";
import { stt_region } from "../../config/api";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

type props = {};
type state = {
  text: string;
};

class STT extends Component<props, state> {
  textRef: React.RefObject<HTMLTextAreaElement>;
  text: any;
  constructor(props) {
    super(props);

    this.state = {
      text: ""
    };
    this.textRef = createRef();
    this.handle = this.handle.bind(this);
  }
  authorizationEndpoint = "token.php";

  handle() {
    // subscription key and region for speech services.
    var subscriptionKey, serviceRegion;
    // var SpeechSDK = require("microsoft-cognitiveservices-speech-sdk");
    var recognizer;

    subscriptionKey = subscription_key;
    serviceRegion = stt_region;

    // if we got an authorization token, use the token. Otherwise use the provided subscription key
    var speechConfig;

    speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      subscriptionKey,
      serviceRegion
    );

    speechConfig.speechRecognitionLanguage = "en-US";
    var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    console.log(recognizer);

    recognizer.recognizeOnceAsync(
      result => {
        console.log(result);
        this.setState(prev => ({
          text: prev.text + result.text
        }));

        recognizer.close();
        recognizer = undefined;
      },
      err => {
        console.log(err);
        this.setState(prev => ({
          text: prev.text + err
        }));

        recognizer.close();
        recognizer = undefined;
      }
    );
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <Head>
          <title>test</title>
          <script src="../../utils/microsoft.cognitiveservices.speech.sdk.bundle.js"></script>
        </Head>
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
