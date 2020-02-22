import React from "react";
import { Layout } from "antd";
import Header from "./Header";
import styled from "styled-components";

const AppLayout = ({ children }) => {
  return (
    <Cover>
      <Layout>
        <Layout.Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            backgroundColor: "#383838"
          }}
        >
          <Header />
        </Layout.Sider>
        <Layout style={{ marginLeft: 200, backgroundColor: "#383838" }}>
          {children}
        </Layout>
      </Layout>
    </Cover>
  );
};

const Cover = styled.div`
  section.ant-layout.ant-layout-has-sider {
    height: 100%;
  }
  height: 100%;
`;

export default AppLayout;
