import React from "react";
import { GET_MEETING_REQUEST } from "../../../reducers/meeting/actions";
import { Card, Avatar, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { store } from "../../../reducers/indext.type";
import { millisToMinutesAndSeconds } from "../../../utils/utilFunction";
import styled from "styled-components";

const meetingID = () => {
  const { currentMeeting } = useSelector(
    (state: store) => state.meeting.meeting
  );

  return (
    <Row>
      <Col span={12}>
        <CardCover>
          <Card style={{ marginTop: 100 }}>
            <h1>속 기 록</h1>
            <h3>참여자</h3>
            {currentMeeting.participants.map(participant => {
              return <Avatar>{participant.nickname}</Avatar>;
            })}
            {currentMeeting.agendas.map(agenda => {
              return (
                <div key={agenda.id}>
                  <h1>{agenda.name}</h1>
                  <p>예상시간 : {agenda.expectedTime}(분)</p>
                  <p>
                    실제걸린시간 : {millisToMinutesAndSeconds(agenda.usedTime)}{" "}
                    만큼 소요
                  </p>
                </div>
              );
            })}
          </Card>
        </CardCover>
      </Col>
      <Col span={12}>
        <Card></Card>
      </Col>
    </Row>
  );
};
const CardCover = styled.div`
  .ant-card.ant-card-bordered {
    width: 500px;
  }
  div {
    margin-top: 20px;
  }
`;

export default meetingID;

meetingID.getInitialProps = ctx => {
  ctx.store.dispatch({
    type: GET_MEETING_REQUEST,
    payload: ctx.query.meetingID
  });
};
