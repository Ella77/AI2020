import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { MAKE_AGENDA } from "../../../reducers/meeting/actions";
import { Form, Button, Input, Icon, InputNumber } from "antd";

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
    <>
      <Form.Item label="안건 이름">
        <Input
          prefix={<Icon type="time" style={{ color: "rgba(0,0,0,.25)" }} />}
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="에상 걸리는 시간(분)">
        <InputNumber
          value={expectedTime}
          type=""
          onChange={value => {
            setExpectedTime(Math.floor(value));
          }}
          step={1}
        />
      </Form.Item>

      <Button type="primary" onClick={_onCreateAgenda}>
        생성
      </Button>
    </>
  );
};

export default MakeAgenda;