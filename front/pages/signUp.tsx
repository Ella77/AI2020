import React, { useEffect } from "react";
import SignUpForm from "../components/signup/SignUpForm";
import { useDispatch } from "react-redux";
import { LOAD_USER_REQUEST } from "../reducers/user/actions";
import { Row, Col } from "antd";
import styled from "styled-components";

const signUp = () => {
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
            fontSize: 38
          }}
        >
          회원가입
        </h1>
        <SignUpForm />
      </Col>
      <Col span={12}>
        <Div>
          <h1>처음 뵙네요! 반갑습니다 :)</h1>
          <h1>회원가입을 통해 Con-Crew를 시작합니다</h1>
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
export default signUp;
