import React from "react";
import styled from "styled-components";

const Agenda = ({ agenda, index, sequenceNumberOfCurrentAgenda }) => {
  console.log(index, sequenceNumberOfCurrentAgenda);
  if (index < sequenceNumberOfCurrentAgenda) {
    return (
      <EndAgendaDiv>
        <div className="end-agenda">
          <p>{agenda.name}</p>
        </div>
      </EndAgendaDiv>
    );
  } else {
    return (
      <AgendaDiv>
        <div className="agenda">
          <p>{agenda.name}</p>
        </div>
      </AgendaDiv>
    );
  }
};

const EndAgendaDiv = styled.div`
  display: inline-block;

  padding: 70px;
  border: solid 2.5px #c8c9ce;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.22;
  margin-right: 20px;
  p {
    max-width: 80px;
    font-size: 12px;
    color: #c8c9ce;
  }
`;
const AgendaDiv = styled.div`
  display: inline-block;
  padding: 70px;
  border: solid 2.5px #fbc210;
  border-radius: 50%;
  margin-right: 20px;
  cursor: pointer;
  p {
    max-width: 80px;
    font-size: 12px;
    color: #fbc210;
  }
`;

export default Agenda;
