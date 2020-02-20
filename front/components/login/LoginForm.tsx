import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_REQUEST } from "../../reducers/user/actions";
import { store } from "../../reducers/indext.type";
import { useRouter } from "next/router";
import { Form, Icon, Input, Button } from "antd";

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
      <Form onSubmit={_onSubmitForm}>
        <Form.Item>
          <Input
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Username"
            value={loginId}
            onChange={e => setLoginId(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Input
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
            placeholder="Password"
            value={plainPassword}
            onChange={e => setPlainPassword(e.target.value)}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          로그인
        </Button>
        <Link href="/signUp">
          <a>회원가입</a>
        </Link>
      </Form>
    </div>
  );
};

export default LoginForm;
