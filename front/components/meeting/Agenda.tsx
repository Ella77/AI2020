import React from "react";
import { useDispatch } from "react-redux";
import { DELETE_AGENDA } from "../../reducers/meeting/actions";

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
    <div className="agenda">
      <p className="agenda-name">안건 이름 {agenda.name}</p>
      <p className="agenda-expectedTime">예상 시간 {agenda.expectedTime}</p>
      <button className="agenda-delete" onClick={_onDeleteButton}>
        삭제
      </button>
    </div>
  );
};

export default Agenda;
