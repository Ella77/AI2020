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
type Keyword = {
  name: string;
  type: string;
  weight: number;
};
type state = {
  text: string;
  caption: string;
  emphasize: string[];
  sequenceNumberOfCurrentAgenda: number;
  state: number;
  participants: any;
  meetingState: number;
  currentKeywords: any;
  keywordChangeFlag: boolean;
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
      emphasize: [],
      sequenceNumberOfCurrentAgenda: 0,
      state: 0,
      currentKeywords: [
        { name: "test1", type: "a", weight: 1 },
        { name: "test1", type: "a", weight: 2 },
        { name: "test1", type: "a", weight: 3 },
        { name: "test1", type: "a", weight: 1 },
        { name: "test1", type: "a", weight: 1 },
        { name: "test1", type: "a", weight: 1 },
        { name: "test1", type: "a", weight: 1 },
        { name: "test1", type: "a", weight: 1 }
      ],
      meetingState: 1,
      participants: [],
      keywordChangeFlag: false
    };
    this.textRef = createRef();
    this.handle = this.handle.bind(this);
  }

  handle(state) {
    console.log("handle", state);
    if (state === 1) {
      this.setState({ state: 1 });
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
          console.log(123123);
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
      this.setState({ state: 0 });
      if (this.recognizer) this.recognizer.close();
      this.recognizer = null;
    }
  }
  _onPressAgenda = () => {
    if (this.state.state == 0) {
      axios.put(`/meetings/${this.props.meetingId}/agenda-sequence`, {
        sequenceNumber: this.state.sequenceNumberOfCurrentAgenda
      });
      this.handle(1);
    } else if (this.state.state == 1) {
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
      this.setState({ caption: data.talking, keywordChangeFlag: true });
      this.setState({ emphasize: data.emphasize });
      this.setState({ state: 1 });
      if (!this.recognizer) {
        this.handle(1);
      }
    });
    this.props.socket.on("stateChange", data => {
      console.log(data);
      switch (data.type) {
        case 1: {
          this.setState({ meetingState: data.state });
          break;
        }
        case 2: {
          if (
            data.sequenceNumberOfCurrentAgenda ===
            this.state.sequenceNumberOfCurrentAgenda
          ) {
            this.setState({ state: 1 });
            this.handle(1);
          } else {
            this.setState({
              sequenceNumberOfCurrentAgenda: data.sequenceNumberOfCurrentAgenda,
              state: 0,
              currentKeywords: []
            });
            if (this.recognizer) {
              this.handle(2);
            }
          }

          break;
        }
        case 3: {
          this.props.handleCallP2P();
          break;
        }
        case 4: {
          console.log("keyword got");
          const newKeyword: { name: string; type: string } = data.entity;
          if (!newKeyword) {
            break;
          }
          const existIdx = this.state.currentKeywords.findIndex(keyword => {
            keyword.name === newKeyword.name;
          });
          if (existIdx === -1) {
            // 처음
            this.setState({
              currentKeywords: [
                ...this.state.currentKeywords,
                { ...newKeyword, weight: 1 }
              ]
            });
          } else {
            // 중복
            this.setState({
              currentKeywords: this.state.currentKeywords.map(
                (keyword, idx) => {
                  if (idx === existIdx) {
                    return { ...keyword, weight: keyword.weight + 1 };
                  } else {
                    return keyword;
                  }
                }
              )
            });
          }
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
        <KeywordDiv>
          {this.state.currentKeywords.slice(5).map((keyword, index) => {
            return (
              <div
                style={{
                  fontSize: 20 + keyword.length * 2,
                  left: index * 20
                }}
              >
                {keyword.word}
              </div>
            );
          })}
        </KeywordDiv>
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
        <KeywordDiv2>
          {this.state.currentKeywords
            .slice(5 + 1, this.state.currentKeywords.length)
            .map((keyword, index) => {
              return (
                <div
                  style={{
                    fontSize: 20 + keyword.length * 2,
                    left: index * 20
                  }}
                >
                  {keyword.word}
                </div>
              );
            })}
        </KeywordDiv2>

        {this.state.meetingState === 2 && (
          <EndAlarm>
            회의 종료
            <div
              onClick={() => {
                Router.replace(`/meeting/detail/${this.props.meetingId}`);
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
          <p>
            caption:
            {this.state.keywordChangeFlag &&
              this.state.caption.split(" ").map(word => {
                if (
                  this.state.emphasize.findIndex(emphasizeWord => {
                    return (
                      emphasizeWord === word ||
                      emphasizeWord === word.slice(0, word.length - 1)
                    );
                  }) !== -1
                ) {
                  console.log(word);
                  let flag = true;
                  let len = 0;
                  let wordIndex = -1;
                  if (this.state.currentKeywords.length < 1) {
                    this.setState({
                      keywordChangeFlag: false,
                      currentKeywords: [{ word, length: 1 }]
                    });
                  } else {
                    //find length
                    this.state.caption.split(" ").map(normalWord => {
                      if (normalWord === word) {
                        len++;
                      }
                    });
                    this.state.currentKeywords.map((keyword, index) => {
                      if (keyword.word === word) {
                        flag = false;
                        wordIndex = index;
                      }
                    });
                    if (flag) {
                      this.setState(prev => ({
                        keywordChangeFlag: false,
                        currentKeywords: [
                          ...prev.currentKeywords,
                          { word, length: 1 }
                        ]
                      }));
                    } else if (wordIndex !== -1) {
                      this.setState(prev => ({
                        keywordChangeFlag: false,
                        currentKeywords: [
                          ...prev.currentKeywords.slice(0, wordIndex),
                          {
                            word: prev.currentKeywords[wordIndex].word,
                            length: len
                          },
                          ...prev.currentKeywords.slice(
                            wordIndex + 1,
                            prev.currentKeywords.length
                          )
                        ]
                      }));
                    }
                  }
                  console.log(this.state.currentKeywords);
                  return (
                    <span style={{ fontWeight: "bold" }}>{word + " "}</span>
                  );
                } else {
                  return <span>{word + " "}</span>;
                }
              })}
          </p>
        </CaptionDiv>
      </div>
    );
  }
}

const KeywordDiv = styled.div`
  font-size: 20px;
  color: white;
  display: inline-block;
  margin-top: 300px;
  position: absolute;
`;
const KeywordDiv2 = styled.div`
  font-size: 20px;
  color: white;
  display: inline-block;
  margin-top: 300px;
  margin-left:700px
  position: absolute;
`;

const EndAlarm = styled.h1`
  text-align: center;
  font-size: 50px;
  color: white;
  cursor: pointer;
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
    span {
      white-space: pre;
    }
  }
`;

export default STT;
