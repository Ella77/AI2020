import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { store } from "../reducers/indext.type";
import { LOGOUT, LOAD_USER_REQUEST } from "../reducers/user/actions";
import { Icon, Avatar } from "antd";
import styled from "styled-components";

const MyfontSize = 40;

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
    <Cover>
      <li className="header">
        <ul>
          <Link href="/">
            <a>
              <Icon style={{ fontSize: MyfontSize }} type="home" />
            </a>
          </Link>
        </ul>
        {me ? (
          <>
            <ul>
              <Link href="/meeting/list">
                <a>
                  <Icon style={{ fontSize: MyfontSize }} type="video-camera" />
                </a>
              </Link>
            </ul>
            <ul onClick={_onClickLogout}>
              <Link href="/">
                <a>
                  <Icon style={{ fontSize: MyfontSize }} type="logout" />
                </a>
              </Link>
            </ul>
            <ul>
              <Link href="/profile">
                <a>
                  <Avatar size={MyfontSize}>{me.nickname}</Avatar>
                </a>
              </Link>
            </ul>
          </>
        ) : (
          <>
            <ul>
              <Link href="/login">
                <a>
                  <Icon style={{ fontSize: 30 }} type="login" />
                </a>
              </Link>
            </ul>
            <ul>
              <Link href="/signUp">
                <a>
                  <Icon style={{ fontSize: 30 }} type="enter" />
                </a>
              </Link>
            </ul>
          </>
        )}
      </li>
    </Cover>
  );
};

const Cover = styled.div`
  li {
    list-style: none;
  }
  ul {
    margin-top: 35px;
  }
`;

export default Header;
