import React, { useEffect } from "react";
import ConferenceMakeForm from "../../components/conference/ConferenceMakeForm";
import { useSelector } from "react-redux";
import { store } from "../../reducers/indext.type";
import { useRouter } from "next/dist/client/router";

const meeting = () => {
  const router = useRouter();
  const { me } = useSelector((state: store) => state.user);

  useEffect(() => {
    if (!me) {
      router.push("/login");
      alert("로그인이 필요합니다");
    }
  }, []);
  if (!me) {
    return <div></div>;
  }

  return (
    <div>
      <ConferenceMakeForm />
    </div>
  );
};

export default meeting;
