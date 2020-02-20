import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { store } from "../reducers/indext.type";
import { LOAD_USER_REQUEST } from "../reducers/user/actions";

const index = () => {
  const { meetings } = useSelector((state: store) => state.meeting.meeting);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST
    });
  }, []);

  return (
    <div>
      {meetings && meetings.map(() => {})}
      <div>
        <Link href="meeting">
          <a>회의 생성</a>
        </Link>
      </div>
    </div>
  );
};

export default index;
