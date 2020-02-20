import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { store } from "../../reducers/indext.type";
import MeetingContainer from "../../components/meeting/meetingRTC/MeetingContainer";

const MeetingID = () => {
  const router = useRouter();
  const [flag, setFlag] = useState(false);
  const { me } = useSelector((state: store) => state.user);
  useEffect(() => {
    if (flag && !me) {
      router.back();
    }
    setFlag(true);
  }, [me]);

  return (
    <div>
      <MeetingContainer meetingId={router.query.meetingID as string} />
    </div>
  );
};

export default MeetingID;
