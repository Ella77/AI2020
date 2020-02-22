import React, { useState, useEffect } from "react";
import { Card, Icon, Col, Row } from "antd";
import { GET_MY_MEETINGS_REQUEST } from "../../reducers/meeting/actions";
import { useSelector } from "react-redux";
import { store } from "../../reducers/indext.type";
import styled from "styled-components";
import Link from "next/link";
import MeetingList from "../../components/meeting/MeetingList";
import { useRouter } from "next/router";

const list = () => {
  const { meetings } = useSelector((state: store) => state.meeting.meeting);
  const { me } = useSelector((state: store) => state.user);
  const router = useRouter();
  const [newMeetingList, setNewMeetingList] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [first, setFirst] = useState(true);

  useEffect(() => {
    if (!first) {
      if (!me) {
        router.replace("/login");
      }
    }
    setFirst(false);
  }, [me]);

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
  if (!me) {
    return (
      <Div>
        <h1>정말 반갑습니다</h1>
        <h1>하지만 로그인이 필요합니다ㅠㅠ</h1>
      </Div>
    );
  }

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

const Div = styled.div`
  justify-content: center;
  margin-top: 350px;
  h1 {
    color: white;
    font-size: 30px;
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
