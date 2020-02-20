import React, { useEffect, useState } from "react";
import MeetingCreateForm from "../../components/meeting/MeetingCreateForm";
import { useSelector, useDispatch } from "react-redux";
import { store } from "../../reducers/indext.type";
import { useRouter } from "next/dist/client/router";
import { LOAD_USER_REQUEST } from "../../reducers/user/actions";

const meeting = () => {
  const [first, setFirst] = useState(true);
  const router = useRouter();
  const { me } = useSelector((state: store) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST
    });
  }, []);
  useEffect(() => {
    if (!first) {
      if (!me) {
        router.push("/login");
        alert("로그인이 필요합니다");
      }
    }
    setFirst(false);
  }, [me]);

  if (!me) {
    return <div></div>;
  }

  return (
    <div>
      <MeetingCreateForm />
    </div>
  );
};

export default meeting;
