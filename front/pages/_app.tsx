import React from "react";
import { Provider } from "react-redux";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Head from "next/head";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/logOnlyInProduction";
import createSagaMiddleware from "redux-saga";
import axios from "axios";
import reducer from "../reducers";
import rootSaga from "../sagas";
import { store } from "../reducers/indext.type";
import { alertOptions } from "../config/alert";
import "./styles.scss";
import AppLayout from "../Layouts/AppLayout";

const App = ({ Component, store, pageProps }) => {
  return (
    <Provider store={store}>
      <Head>
        <title>kpmg</title>
        <script src="microsoft.cognitiveservices.speech.sdk.bundle.js"></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.18.1/antd.css"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.18.1/antd.js"></script>
      </Head>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </AlertProvider>
    </Provider>
  );
};

App.getInitialProps = async context => {
  let pageProps = {};
  const { ctx, Component } = context;
  const state = ctx.store.getState();
  const cookie = ctx.isServer ? ctx.req.headers.cookie : "";
  if (ctx.isServer && cookie) {
    axios.defaults.headers.cookie = cookie;
  }
  if (!state.user.user && cookie) {
    // ctx.store.dispatch({
    //   //load user request
    // });
  }
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
};

// FOR REDUX DEVTOOLS EXTENSION
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: typeof compose;
  }
}

const configureStore = (initialState: store) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const composeEnhancer = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
  });
  const enhancer = composeEnhancer(applyMiddleware(...middlewares));
  const store = createStore(reducer, initialState, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

export default withRedux(configureStore)(withReduxSaga(App));
