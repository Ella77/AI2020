import React from "react";
import { Card, Avatar } from "antd";
import {
  meetingStore,
  currentMeeting
} from "../../reducers/meeting/interfaces";
import styled from "styled-components";
import { useRouter } from "next/router";

type props = {
  meeting: currentMeeting;
};

const MeetingList = (props: props) => {
  const router = useRouter();

  const _onClickMeeting = () => {
    if (props.meeting.state == 2) {
      router.push(`/meeting/detail/${props.meeting._id}`);
    }
    router.push(`/meeting/${props.meeting._id}`);
  };
  return (
    <Div onClick={_onClickMeeting}>
      <h2>{props.meeting.name}</h2>
      {new Date(props.meeting.createdAt).toDateString()} 시작
      <div id="meeting">
        {props.meeting.participants.map(participant => {
          return <Avatar key={participant._id}>{participant.nickname}</Avatar>;
        })}
      </div>
      {props.meeting.state === 2 ? (
        <p id="state">종료</p>
      ) : (
        props.meeting.state === 1 && <p id="state">진행중</p>
      )}
    </Div>
  );
};

const Div = styled.a`
  background-color: #eef3f9;
  padding: 30px;
  margin: 10px;
  display: block;
  p {
    margin-top: 5px;
    font-family: NanumSquareR;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.13;
    letter-spacing: normal;
    text-align: left;
    color: #000000;
  }
  #meeting {
    float: right;
  }
  #state {
    float: right;
  }
`;

export default MeetingList;
