import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { store } from "../reducers/indext.type";

const Header = () => {
  const { me } = useSelector((state: store) => state.user);

  return (
    <>
      <li>
        <ul>
          <Link href="/">
            <a>Home</a>
          </Link>
        </ul>
        {me ? (
          <>
            <ul>
              <Link href="/meeting">
                <a>회의생성</a>
              </Link>
            </ul>
            <ul>
              <button>로그아웃</button>
            </ul>
          </>
        ) : (
          <>
            <ul>
              <Link href="/login">
                <a>login</a>
              </Link>
            </ul>
            <ul>
              <Link href="/signUp">
                <a>signup</a>
              </Link>
            </ul>
          </>
        )}
      </li>
    </>
  );
};

export default Header;
