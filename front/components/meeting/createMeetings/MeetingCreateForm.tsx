import React, { useState, useEffect } from "react";
import MakeAgendaForm from "./MakeAgendaForm";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../../reducers/indext.type";
import Agenda from "./Agenda";
import { Form, Input, Icon, Button, Card } from "antd";
import { CREATE_MEETING_REQUEST } from "../../../reducers/meeting/actions";
import { useRouter } from "next/router";
import styled from "styled-components";

const ConferenceMakeForm = () => {
  const [name, setName] = useState("");
  const router = useRouter();
  const { currentAgendas, currentMeeting } = useSelector(
    (state: store) => state.meeting.meeting
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentMeeting && currentMeeting._id) {
      router.push(`/meeting/${currentMeeting._id}`);
    }
  }, [currentMeeting]);

  const _onSubmitForm = e => {
    e.preventDefault();
    dispatch({
      type: CREATE_MEETING_REQUEST,
      payload: {
        name,
        currentAgendas
      }
    });
  };

  return (
    <CardCover>
      <Card style={{ marginTop: 100 }}>
        <Form onSubmit={_onSubmitForm}>
          <Form.Item label="회의 이름">
            <Input
              value={name}
              onChange={e => {
                setName(e.target.value);
              }}
              prefix={
                <Icon
                  type="smile"
                  style={{
                    color: "rgba(0,0,0,.25)"
                  }}
                />
              }
              placeholder="회의 이름"
            />
            {currentAgendas &&
              currentAgendas.map(agenda => {
                return <Agenda key={agenda.id} agenda={agenda} />;
              })}
          </Form.Item>
          <MakeAgendaForm />
          <Button htmlType="submit" type="primary">
            회의 시작
          </Button>
        </Form>
      </Card>
    </CardCover>
  );
};

const CardCover = styled.div`
  .ant-card.ant-card-bordered {
    width: 500px;
  }
`;

export default ConferenceMakeForm;
