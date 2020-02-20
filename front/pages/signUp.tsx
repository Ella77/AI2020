import React, { useEffect } from "react";
import SignUpForm from "../components/signup/SignUpForm";
import { useDispatch } from "react-redux";
import { LOAD_USER_REQUEST } from "../reducers/user/actions";

const signUp = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST
    });
  }, []);
  return (
    <div>
      <h1>회원가입</h1>
      <SignUpForm />
    </div>
  );
};

export default signUp;
