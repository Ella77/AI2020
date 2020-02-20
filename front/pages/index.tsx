import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { store } from "../reducers/indext.type";

const index = () => {
  const { meetings } = useSelector((state: store) => state.agenda);

  return (
    <div>
      {meetings.map(() => {})}
      <div>
        <Link href="meeting">
          <a>회의 생성</a>
        </Link>
      </div>
    </div>
  );
};

export default index;
