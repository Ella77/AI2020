import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { MAKE_AGENDA } from "../../../reducers/meeting/actions";
import { Form, Button, Input, Icon, InputNumber } from "antd";
import styled from "styled-components";

const MakeAgenda = () => {
  const [name, setName] = useState("");
  const [expectedTime, setExpectedTime] = useState(0);
  const dispath = useDispatch();

  const _onCreateAgenda = e => {
    e.preventDefault();
    dispath({
      type: MAKE_AGENDA,
      payload: {
        id: Math.random(),
        name,
        expectedTime
      }
    });
    setName("");
    setExpectedTime(0);
  };

  return (
    <AgendaDiv>
      <Form.Item label="안건 이름">
        <Input
          prefix={<Icon type="time" style={{ color: "rgba(0,0,0,.25)" }} />}
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="에상 걸리는 시간(분)">
        <Icon type="clock-circle" style={{ fontSize: 20, paddingRight: 10 }} />
        <InputNumber
          value={expectedTime}
          type=""
          onChange={value => {
            setExpectedTime(Math.floor(value));
          }}
          step={1}
        />
        <Icon
          style={{ fontSize: 30, float: "right" }}
          type="plus-circle"
          onClick={_onCreateAgenda}
        />
      </Form.Item>
    </AgendaDiv>
  );
};

const AgendaDiv = styled.div``;

export default MakeAgenda;
