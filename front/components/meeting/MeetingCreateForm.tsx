import React, { useState, useEffect } from "react";
import MakeAgendaForm from "./MakeAgendaForm";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../reducers/indext.type";
import Agenda from "./Agenda";
import { Form, Input, Icon, Button } from "antd";

const ConferenceMakeForm = () => {
  const [name, setName] = useState("");
  const [agendaList, setAgendaList] = useState([]);
  const [agendaNum, setAgendaNum] = useState(1);

  const { currentAgendas } = useSelector(
    (state: store) => state.meeting.meeting
  );
  const dispatch = useDispatch();

  const _onCreateConference = e => {
    e.preventDefault();
    setAgendaList(state => [...state, agendaNum]);
    setAgendaNum(state => state + 1);
  };

  useEffect(() => {}, []);

  const _onSubmitForm = e => {
    e.prevent;
  };

  return (
    <>
      <Form>
        <Form.Item label="회의 이름">
          <Input
            value={name}
            onChange={e => {
              setName(e.target.value);
            }}
            prefix={<Icon type="smile" style={{ color: "rgba(0,0,0,.25)" }} />}
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
