import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { MAKE_AGENDA } from "../../reducers/agenda/actions";

const MakeAgenda = () => {
  const [name, setName] = useState("");
  const [expectedTime, setExpectedTime] = useState(0);
  const dispath = useDispatch();

  const _onSubmitForm = e => {
    e.preventDefault();
    dispath({
      type: MAKE_AGENDA,
      payload: {
        name,
        expectedTime
      }
    });
  };

  return (
    <form onSubmit={_onSubmitForm}>
      <label>안건 이름</label>
      <input value={name} onChange={e => setName(e.target.value)} />
      <label>예상 걸리는 시간(분)</label>
      <input
        value={expectedTime}
        onChange={e => setExpectedTime(Number(e.target.value))}
      />
      <button type="submit">생성</button>
    </form>
  );
};

export default MakeAgenda;
