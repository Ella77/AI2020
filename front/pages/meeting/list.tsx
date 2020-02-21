import React from "react";
import { Card, Icon } from "antd";
import { GET_MY_MEETINGS_REQUEST } from "../../reducers/meeting/actions";
import { useSelector } from "react-redux";
import { store } from "../../reducers/indext.type";
import styled from "styled-components";
import Link from "next/link";
import MeetingList from "../../components/meeting/MeetingList";

const list = () => {
  const { meetings } = useSelector((state: store) => state.meeting.meeting);

  return (
    <CardCover>
      <Card style={{ marginTop: 100 }}>
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
            return <MeetingList key={meeting._id} meeting={meeting} />;
          })}
      </Card>
    </CardCover>
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
