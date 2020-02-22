import React from "react";
import styled from "styled-components";
import { Avatar } from "antd";

const MainProfileScreen = ({ me }) => {
  if (!me) {
    return (
      <div>
        <h1>로그인 해주세요!</h1>
      </div>
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
  margin-top: 300px;
  h1 {
    color: white;
    font-size: 20px;
  }
`;

export default MainProfileScreen;
