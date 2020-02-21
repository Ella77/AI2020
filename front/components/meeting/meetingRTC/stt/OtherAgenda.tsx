import React from "react";

const Agenda = ({ agenda, sequenceNumberOfCurrentAgenda }) => {
  return (
    <div>
      <p>{agenda.name}</p>
    </div>
  );
};

export default Agenda;
