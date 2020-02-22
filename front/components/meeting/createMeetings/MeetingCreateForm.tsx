import React, { useState, useEffect } from "react";
import MakeAgendaForm from "./MakeAgendaForm";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../../reducers/indext.type";
import Agenda from "./Agenda";
import { Form, Input, Icon, Button, Card, Col, Row } from "antd";
import { CREATE_MEETING_REQUEST } from "../../../reducers/meeting/actions";
import { useRouter } from "next/router";
import styled from "styled-components";

const ConferenceMakeForm = ({ me }) => {
  const [name, setName] = useState("");
  const [flag, setFlag] = useState(false);
  const router = useRouter();
  const { currentAgendas, currentMeeting } = useSelector(
    (state: store) => state.meeting.meeting
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (flag && currentMeeting && currentMeeting._id) {
      router.push(`/meeting/${currentMeeting._id}`);
    }
    setFlag(true);
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
    <Row>
      <Col span={12}>
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
      </Col>
      <Col span={12}>
        <Description>
          <h1>{me.nickname}님,</h1>
          <p> 효율적인 회의를 시작하기 위해 회의를 생성해주세요</p>
        </Description>
      </Col>
    </Row>
  );
};

const Description = styled.div`
  margin-top: 200px;
  h1 {
    color: white;
    font-size: 40px;
  }
  p {
    font-size: 20px;
    color: white;
  }
`;

const CardCover = styled.div`
  .ant-card.ant-card-bordered {
    width: 500px;
  }
`;

export default ConferenceMakeForm;
