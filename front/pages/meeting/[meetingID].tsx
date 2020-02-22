import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { store } from "../../reducers/indext.type";
import MeetingContainer from "../../components/meeting/meetingRTC/MeetingContainer";
import { GET_MEETING_REQUEST } from "../../reducers/meeting/actions";

const MeetingID = () => {
  const router = useRouter();
  const [flag, setFlag] = useState(false);
  const { me } = useSelector((state: store) => state.user);
  useEffect(() => {
    if (flag && !me) {
      router.back();
      alert("로그인이 필요합니다");
    }
    setFlag(true);
  }, [me]);

  return (
    <div>
      <MeetingContainer meetingId={router.query.meetingID as string} />
    </div>
  );
};

MeetingID.getInitialProps = ctx => {
  console.log(ctx.query);
  ctx.store.dispatch({
    type: GET_MEETING_REQUEST,
    payload: ctx.query.meetingID
  });
};

export default MeetingID;
