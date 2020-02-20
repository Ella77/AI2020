import React, { useState, useEffect } from "react";
import MakeAgendaForm from "./MakeAgendaForm";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../../reducers/indext.type";
import Agenda from "./Agenda";
import { Form, Input, Icon, Button } from "antd";
import { CREATE_MEETING_REQUEST } from "../../../reducers/meeting/actions";
import { useRouter } from "next/router";

const ConferenceMakeForm = () => {
  const [name, setName] = useState("");
  const router = useRouter();
  const { currentAgendas, currentMeeting } = useSelector(
    (state: store) => state.meeting.meeting
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentMeeting.id) {
      router.push(`/meeting/${currentMeeting.id}`);
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
    <>
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
    </>
  );
};

export default ConferenceMakeForm;
