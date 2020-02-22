import React from "react";
import styled from "styled-components";
import { Avatar } from "antd";

const MainProfileScreen = ({ me }) => {
  if (!me) {
    return (
      <Div>
        <h1>본 서비스는 로그인이 필요합니다</h1>
      </Div>
    );
  }
  return (
    <Div>
      <h1>안녕하십니까?{me.nickname}님</h1>
      <h1>Con-Crew로 효율적인 회의를 체험해보세요</h1>
    </Div>
  );
};

const Div = styled.div`
  justify-content: center;
  margin-top: 400px;
  h1 {
    color: white;
    font-size: 30px;
  }
`;

export default MainProfileScreen;
