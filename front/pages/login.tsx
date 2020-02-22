import React, { useEffect } from "react";
import LoginForm from "../components/login/LoginForm";
import { useDispatch } from "react-redux";
import { LOAD_USER_REQUEST } from "../reducers/user/actions";
import { Row, Col } from "antd";
import styled from "styled-components";

const login = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST
    });
  }, []);
  return (
    <Row>
      <Col span={12}>
        <h1
          style={{
            marginLeft: 200,
            marginTop: 100,
            color: "white",
            fontSize: 39
          }}
        >
          로그인
        </h1>
        <LoginForm />
      </Col>
      <Col span={12}>
        <Div>
          <h1>정말 반갑습니다</h1>
          <h1>Con-Crew로 효율적인 회의를 체험해봅시다!</h1>
        </Div>
      </Col>
    </Row>
  );
};

const Div = styled.div`
  justify-content: center;
  margin-top: 350px;
  h1 {
    color: white;
    font-size: 30px;
  }
`;

export default login;
