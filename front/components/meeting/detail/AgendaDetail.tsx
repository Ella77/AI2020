import React from "react";
import { useSelector } from "react-redux";
import { store } from "../../../reducers/indext.type";
import { Avatar, Icon } from "antd";
import styled from "styled-components";

const AgendaDetail = ({ agenda, currentMeeting }) => {
  return (
    <div>
      <h1>{agenda.name}</h1>
      <h1>속기록</h1>
      {agenda.sentiment.neutral > 6 ? (
        <Icon style={{ fontSize: 40 }} type="meh" />
      ) : agenda.sentiment.positive > 5 ? (
        <Icon style={{ fontSize: 40 }} type="smile" />
      ) : agenda.sentiment.negative > 5 ? (
        <Icon style={{ fontSize: 40 }} type="frown" />
      ) : (
        <Icon style={{ fontSize: 40 }} type="meh" />
      )}
      {agenda.records.map(record => {
        return (
          <Div key={record.sentence}>
            {currentMeeting.participants.map(participant => {
              if (participant._id === record.userId)
                return <Avatar>{participant.nickname}</Avatar>;
            })}
            {" : "}
            {record.sentence}

            {record.keyPhrases.length > 0 && (
              <>
                <KeywordTitle>keyword</KeywordTitle>
                {record.keyPhrases.map(keyword => (
                  <KeywordDiv>{keyword}</KeywordDiv>
                ))}
              </>
            )}
          </Div>
        );
      })}
    </div>
  );
};

const KeywordTitle = styled.h3`
  margin-top: 20px;
  margin-bottom: 0px;
`;

const KeywordDiv = styled.div`
  display: inline-block;
  margin-left: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
`;

const Div = styled.div`
  border: 1px solid gray;
  margin-top: 0px;
  border-radius: 1rem;
`;

export default AgendaDetail;
