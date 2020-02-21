import React from "react";
import { useDispatch } from "react-redux";
import { DELETE_AGENDA } from "../../../reducers/meeting/actions";
import { Icon, Typography } from "antd";
import styled from "styled-components";

const Agenda = ({ agenda }) => {
  const dispatch = useDispatch();

  const _onDeleteButton = e => {
    e.preventDefault();
    dispatch({
      type: DELETE_AGENDA,
      payload: agenda
    });
  };
  return (
    <AgendaDiv>
      <Typography.Title className="agenda-name">{agenda.name}</Typography.Title>
      <InlineDiv>
        <h1 className="agenda-expectedTime">{agenda.expectedTime}분</h1>
        <Icon
          style={{ fontSize: 30 }}
          type="delete"
          className="agenda-delete"
          onClick={_onDeleteButton}
        />
      </InlineDiv>
    </AgendaDiv>
  );
};

const InlineDiv = styled.div`
  display: grid;
`;

const AgendaDiv = styled.div`
  border: 1px solid;
  border-radius: 1rem;
  margin: 10px;
  text-align: center;
`;

export default Agenda;
