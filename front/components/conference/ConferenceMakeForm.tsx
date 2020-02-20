import React, { useState, useEffect } from "react";
import MakeAgendaForm from "./MakeAgendaForm";
import { useDispatch, useSelector } from "react-redux";
import { store } from "../../reducers/indext.type";
import Agenda from "./Agenda";

const ConferenceMakeForm = () => {
  const [name, setName] = useState("");
  const [agendaList, setAgendaList] = useState([]);
  const [agendaNum, setAgendaNum] = useState(1);

  const { currentAgendas } = useSelector((state: store) => state.agenda);
  const dispatch = useDispatch();

  const _onCreateConference = e => {
    e.preventDefault();
    setAgendaList(state => [...state, agendaNum]);
    setAgendaNum(state => state + 1);
  };

  useEffect(() => {}, []);

  const _onSubmitForm = e => {
    e.prevent;
  };

  return (
    <form>
      <label>회의 이름</label>
      <input
        value={name}
        onChange={e => {
          setName(e.target.value);
        }}
      />
      {currentAgendas.map(agenda => {
        return <Agenda key={agenda.name} agenda={agenda} />;
      })}
      <MakeAgendaForm />
      <button type="submit">회의 시작</button>
    </form>
  );
};

export default ConferenceMakeForm;
