import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { store } from "../reducers/indext.type";
import { LOAD_USER_REQUEST } from "../reducers/user/actions";
import { GET_MEETINGS_REQUEST } from "../reducers/meeting/actions";
import MeetingList from "../components/meeting/MeetingList";
import { Card, Icon, Layout, Row, Col, Pagination, Spin } from "antd";
import styled from "styled-components";
import MainProfileScreen from "../components/meeting/MainProfileScreen";

const index = () => {
  const { meetings, lastPage } = useSelector(
    (state: store) => state.meeting.meeting
  );
  const { isGetMeetings } = useSelector(
    (state: store) => state.meeting.loadingStates
  );
  const { me } = useSelector((state: store) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST
    });
  }, []);

  const _onChnagePage = number => {
    dispatch({
      type: GET_MEETINGS_REQUEST,
      payload: { page: number - 1 }
    });
  };
  return (
    <div>
      <Row style={{ backgroundColor: "#383838" }}>
        <Col span={12}>
          <CardCover>
            <Card style={{ marginTop: 100 }}>
              {isGetMeetings ? (
                <Spin
                  style={{
                    height: "600px",
                    width: "400px",
                    textAlign: "center",
                    justifyContent: "center",
                    justifySelf: "center",
                    alignContent: "center"
                  }}
                  size="large"
                />
              ) : (
                <>
                  <CardHeader>
                    <Link href="meeting">
                      <a>
                        <Icon
                          style={{ fontSize: 80, marginBottom: 20 }}
                          type="plus-circle"
                        />
                      </a>
                    </Link>
                    <h1 className="meeting-list-header">생성된 미팅리스트</h1>
                  </CardHeader>
                  {meetings &&
                    meetings.map(meeting => {
                      return (
                        <MeetingList key={meeting._id} meeting={meeting} />
                      );
                    })}
                </>
              )}

              <Pagination
                onChange={_onChnagePage}
                defaultCurrent={1}
                total={lastPage * 10}
              />
            </Card>
          </CardCover>
        </Col>
        <Col span={12}>
          <Layout.Content>
            <MainProfileScreen me={me} />
          </Layout.Content>
        </Col>
      </Row>
    </div>
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

index.getInitialProps = ctx => {
  ctx.store.dispatch({
    type: GET_MEETINGS_REQUEST,
    payload: {
      page: 1
    }
  });
};

export default index;
