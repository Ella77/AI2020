import React, { useEffect, useState } from "react";
import MeetingCreateForm from "../../components/meeting/createMeetings/MeetingCreateForm";
import { useSelector, useDispatch } from "react-redux";
import { store } from "../../reducers/indext.type";
import { useRouter } from "next/dist/client/router";
import { LOAD_USER_REQUEST } from "../../reducers/user/actions";
import styled from "styled-components";

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
    return <h1>로그인이 필요합니다</h1>;
  }

  return (
    <>
      <H1>미팅 생성</H1>
      <MeetingCreateForm me={me} />
    </>
  );
};

const H1 = styled.h1`
  color: white;
  font-size: 43px;
  margin-top: 60px;
  /* margin-left: 60px; */
  text-align: center;
`;

export default meeting;
