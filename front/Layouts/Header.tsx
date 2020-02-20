import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { store } from "../reducers/indext.type";
import { LOGOUT, LOAD_USER_REQUEST } from "../reducers/user/actions";

const Header = () => {
  const { me } = useSelector((state: store) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST
    });
  }, []);

  const _onClickLogout = () => {
    dispatch({
      type: LOGOUT
    });
  };
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
            <ul onClick={_onClickLogout}>
              <Link href="/">
                <a>로그아웃</a>
              </Link>
            </ul>
          </>
        ) : (
          <>
            <ul>
              <Link href="/login">
                <a>로그인</a>
              </Link>
            </ul>
            <ul>
              <Link href="/signUp">
                <a>회원가입</a>
              </Link>
            </ul>
          </>
        )}
      </li>
    </>
  );
};

export default Header;
