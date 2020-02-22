import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const CurrentAgenda = ({ agenda, onPress, state }) => {
  const [usedTime, setUsedTime] = useState(0);
  useEffect(() => {
    setInterval(() => setUsedTime(usedTime + 1), 1000);
  })
  if (state === 1) {
    return (
      <Div className="current-agenda" onClick={onPress}>
        <div style={{position: 'absolute', fontSize: 20, color: 'white', top: -40}}>{Math.floor((agenda.expectedTime- usedTime) / 60) + ' : ' + (agenda.expectedTime- usedTime) % 60}</div>
        <p>{agenda.name}</p>
      </Div>
    );
  }
  return (
    <CurrentDiv className="current-agenda" onClick={onPress}>
        <div style={{position: 'absolute', fontSize: 20, color: 'white', top: -40}}>{Math.floor((agenda.expectedTime- usedTime) / 60) + ' : ' + (agenda.expectedTime- usedTime) % 60}</div>
      <p>{agenda.name}</p>
    </CurrentDiv>
  );
};
const CurrentDiv = styled.div`
  position: absolute;
  display: inline-block;
  padding: 140px;
  border: solid 3px #31aaf3;
  text-align: center;
  border-radius: 50%;
  left: 500px;
  top: 300px;
  cursor: pointer;

  p {
    font-family: Arial;
    font-size: 17.5px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.14;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
    max-width: 150;
  }
`;

const Div = styled.div`
  position: absolute;
  display: inline-block;
  padding: 140px;
  border: solid 3px red;
  text-align: center;
  border-radius: 50%;
  left: 500px;
  top: 300px;
  cursor: pointer;

  p {
    font-family: Arial;
    font-size: 17.5px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.14;
    letter-spacing: normal;
    text-align: left;
    color: #ffffff;
    max-width: 150;
  }
`;
export default CurrentAgenda;
