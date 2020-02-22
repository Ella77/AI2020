import React, { useState, useEffect } from "react";
import { Form, Input, Icon, Button, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { SIGN_UP_REQUEST } from "../../reducers/user/actions";
import { store } from "../../reducers/indext.type";
import { useRouter } from "next/router";

const SignUpForm = ({ form }) => {
  const [confirmDirty, setConfirmDirty] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { me } = useSelector((state: store) => state.user);

  useEffect(() => {
    if (me) {
      router.push("/");
    }
  }, [me]);

  const _onSubmitForm = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      console.log("Received values of form: ", values);
      if (!err) {
        dispatch({
          type: SIGN_UP_REQUEST,
          payload: {
            nickname: form.getFieldValue("nickname"),
            loginId: form.getFieldValue("loginId"),
            plainPassword: form.getFieldValue("password")
          }
        });
      }
    });
  };

  const validateToNextPassword = (rule, value, callback) => {
    console.log(value);
    if (value.length < 8) {
      callback("The password has to at least 8 lengths");
    } else if (value && confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };
  const compareToFirstPassword = (rule, value, callback) => {
    if (value.length < 8) {
      callback("The password has to at least 8 lengths");
    } else if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  return (
    <Card style={{ marginTop: 100, width: 500 }}>
      <Form onSubmit={_onSubmitForm}>
        <Form.Item label="nickname" hasFeedback>
          {form.getFieldDecorator("nickname", {
            rules: [
              {
                required: true,
                message: "Please input your nickname"
              }
            ]
          })(
            <Input
              prefix={
                <Icon type="smile" style={{ color: "rgba(0,0,0,.25)" }} />
              }
              placeholder="nickname"
            />
          )}
        </Form.Item>
        <Form.Item label="Login ID" hasFeedback>
          {form.getFieldDecorator("loginId", {
            rules: [
              {
                required: true,
                message: "Please input your login ID"
              }
            ]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="ID"
            />
          )}
        </Form.Item>
        <Form.Item label="Password" hasFeedback>
          {form.getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "Please input your password!"
              },
              {
                validator: validateToNextPassword
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="password"
              type="password"
            />
          )}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {form.getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "Please confirm your password!"
              },
              {
                validator: compareToFirstPassword
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Confirm Password"
            />
          )}
        </Form.Item>

        <Button type="primary" htmlType="submit">
          회원가입
        </Button>
      </Form>
    </Card>
  );
};

export default Form.create({ name: "signup" })(SignUpForm);
