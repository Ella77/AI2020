import React, { useEffect } from "react";
import LoginForm from "../components/login/LoginForm";
import { useDispatch } from "react-redux";
import { LOAD_USER_REQUEST } from "../reducers/user/actions";

const login = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST
    });
  }, []);
  return (
    <div>
      <h1>로그인</h1>
      <LoginForm />
    </div>
  );
};

export default login;
