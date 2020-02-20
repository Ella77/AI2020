import React from "react";
import { useSelector } from "react-redux";
import { store } from "../../reducers/indext.type";

const MeetingID = () => {
  const { currentConference } = useSelector((state: store) => state.agenda);

  return <div></div>;
};

export default MeetingID;
