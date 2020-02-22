import React, { useState } from "react";
import { GET_MEETING_REQUEST } from "../../../reducers/meeting/actions";
import { Card, Avatar, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { store } from "../../../reducers/indext.type";
import { millisToMinutesAndSeconds } from "../../../utils/utilFunction";
import styled from "styled-components";
import AgendaDetail from "../../../components/meeting/detail/AgendaDetail";

const meetingID = () => {
  const { currentMeeting } = useSelector(
    (state: store) => state.meeting.meeting
  );
  const [detailAgenda, setDetailAgenda] = useState(null);

  const _onClickAgenda = agenda => {
    setDetailAgenda(agenda);
  };

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
                <AgendaContainer
                  key={agenda.id}
                  className="agenda-container"
                  onClick={() => {
                    _onClickAgenda(agenda);
                  }}
                >
                  <h1>{agenda.name}</h1>
                  <p>예상시간 : {agenda.expectedTime}(분)</p>
                  <p>
                    실제걸린시간 : {millisToMinutesAndSeconds(agenda.usedTime)}{" "}
                    만큼 소요
                  </p>
                </AgendaContainer>
              );
            })}
          </Card>
        </CardCover>
      </Col>
      <Col span={12}>
        <CardCover>
          <Card style={{ marginTop: 100 }}>
            {detailAgenda ? (
              <AgendaDetail
                agenda={detailAgenda}
                currentMeeting={currentMeeting}
              />
            ) : (
              <div>안건을 클릭하여 자세한 내용을 확인해보세요!</div>
            )}
          </Card>
        </CardCover>
      </Col>
    </Row>
  );
};

const AgendaContainer = styled.div`
  background-color: cornflowerblue;
  border-radius: 0.6rem;
  padding: 1px;
  margin: 1px;
  h1 {
    color: white;
  }
`;

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
