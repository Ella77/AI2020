import React, { useState, useEffect } from "react";
import { Card, Icon, Col, Row } from "antd";
import { GET_MY_MEETINGS_REQUEST } from "../../reducers/meeting/actions";
import { useSelector } from "react-redux";
import { store } from "../../reducers/indext.type";
import styled from "styled-components";
import Link from "next/link";
import MeetingList from "../../components/meeting/MeetingList";

const list = () => {
  const { meetings } = useSelector((state: store) => state.meeting.meeting);
  const [newMeetingList, setNewMeetingList] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [completedList, setCompletedList] = useState([]);

  useEffect(() => {
    if (meetings) {
      meetings.map(meeting => {
        if (meeting.state == 0) {
          setNewMeetingList(prev => [...prev, meeting]);
        } else if (meeting.state == 1) {
          setProgressList(prev => [...prev, meeting]);
        } else {
          setCompletedList(prev => [...prev, meeting]);
        }
      });
    }
  }, [meetings]);

  return (
    <>
      <Row>
        <Col span={12}>
          <CardCover>
            <Card style={{ marginTop: 100 }}>
              <CardHeader>
                <Link href="/meeting">
                  <a>
                    <Icon
                      style={{ fontSize: 80, marginBottom: 20 }}
                      type="plus-circle"
                    />
                  </a>
                </Link>
                <h1 className="meeting-list-header">
                  내가 새롭게 만든 미팅 리스트
                </h1>
              </CardHeader>
              {newMeetingList &&
                newMeetingList.map(meeting => {
                  return <MeetingList key={meeting._id} meeting={meeting} />;
                })}
            </Card>
          </CardCover>
        </Col>
        <Col span={12}>
          <CardCover>
            <Card style={{ marginTop: 100 }}>
              <CardHeader>
                <Link href="/meeting">
                  <a>
                    <Icon
                      style={{ fontSize: 80, marginBottom: 20 }}
                      type="plus-circle"
                    />
                  </a>
                </Link>
                <h1 className="meeting-list-header">
                  내가 참여한 진행중인 미팅 리스트
                </h1>
              </CardHeader>
              {progressList &&
                progressList.map(meeting => {
                  return <MeetingList key={meeting._id} meeting={meeting} />;
                })}
            </Card>
          </CardCover>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <CardCover>
            <Card style={{ marginTop: 100 }}>
              <CardHeader>
                <Link href="/meeting">
                  <a>
                    <Icon
                      style={{ fontSize: 80, marginBottom: 20 }}
                      type="plus-circle"
                    />
                  </a>
                </Link>
                <h1 className="meeting-list-header">
                  내가 참여한 종료된 미팅 리스트
                </h1>
              </CardHeader>
              {completedList &&
                completedList.map(meeting => {
                  return <MeetingList key={meeting._id} meeting={meeting} />;
                })}
            </Card>
          </CardCover>
        </Col>
      </Row>
    </>
  );
};
const CardCover = styled.div`
  .ant-card.ant-card-bordered {
    width: 500px;
  }
`;

const CardHeader = styled.div`
  h1.meeting-list-header {
    display: inline;
    font-size: 30px;
  }
`;

list.getInitialProps = ctx => {
  ctx.store.dispatch({
    type: GET_MY_MEETINGS_REQUEST
  });
};

export default list;
