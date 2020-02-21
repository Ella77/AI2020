import React from "react";

const CurrentAgenda = ({ agenda, onPress }) => {
  return (
    <div onClick={onPress}>
      <p>현재 :{agenda.name}</p>
    </div>
  );
};

export default CurrentAgenda;
