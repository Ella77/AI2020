import React from "react";
import { Card } from "antd";
import { meetingStore } from "../../reducers/meeting/interfaces";
import styled from "styled-components";
import { useRouter } from "next/router";

type props = {
  meeting: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    state: number;
  };
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
      <p>{props.meeting.name}</p>
      {props.meeting.createdAt}시작
      {props.meeting.state === 2 ? (
        <p>종료</p>
      ) : (
        props.meeting.state === 1 && <p>진행중</p>
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
`;

export default MeetingList;
