import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_REQUEST } from "../../reducers/user/actions";
import { store } from "../../reducers/indext.type";
import { useRouter } from "next/router";

const LoginForm = () => {
  const [loginId, setLoginId] = useState("");
  const [plainPassword, setPlainPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { me } = useSelector((state: store) => state.user);

  useEffect(() => {
    if (me) {
      router.push("/profile");
    }
  }, [me]);

  const _onSubmitForm = e => {
    e.preventDefault();
    dispatch({
      type: LOGIN_REQUEST,
      payload: {
        loginId,
        plainPassword
      }
    });
  };

  return (
    <div>
      <form onSubmit={_onSubmitForm}>
        <label>아이디</label>
        <input value={loginId} onChange={e => setLoginId(e.target.value)} />
        <label>비밀번호</label>
        <input
          value={plainPassword}
          onChange={e => setPlainPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
        <Link href="/singUp">
          <a>회원가입</a>
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
