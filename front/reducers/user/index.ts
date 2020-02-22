import produce from "immer";
import {
  SIGN_UP_REQUEST,
  SIGN_UP_FAILURE,
  SIGN_UP_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOGOUT
} from "./actions";
import { userStore, userActions } from "./interfaces";

const initialState: userStore = {
  me: null,
  loadingStates: {
    isLoadingUser: false,
    isLoging: false,
    isLogouting: false,
    isSigning: false
  },
  metaStates: {
    isLoggedIn: false,
    loginStatusCode: 0,
    signUpStatusCode: 0
  }
};

export default (state = initialState, action: userActions) => {
  return produce(state, draft => {
    switch (action.type) {
      case SIGN_UP_REQUEST: {
        draft.loadingStates.isSigning = true;
        break;
      }

      case SIGN_UP_SUCCESS: {
        draft.loadingStates.isSigning = false;
        draft.me = action.result.user;
        localStorage.setItem("user", JSON.stringify(action.result.user));
        break;
      }
      case SIGN_UP_FAILURE: {
        draft.loadingStates.isSigning = false;
        break;
      }

      case LOGIN_REQUEST: {
        draft.loadingStates.isLoging = true;
        break;
      }

      case LOGIN_SUCCESS: {
        draft.loadingStates.isLoging = false;
        draft.me = action.result.user;
        draft.metaStates.loginStatusCode = 200;
        localStorage.setItem("user", JSON.stringify(action.result.user));
        break;
      }
      case LOGIN_FAILURE: {
        draft.loadingStates.isLoging = false;
        draft.metaStates.loginStatusCode = action.error;
        break;
      }

      case LOAD_USER_REQUEST: {
        draft.loadingStates.isLoadingUser = true;
        break;
      }

      case LOAD_USER_SUCCESS: {
        draft.loadingStates.isLoadingUser = false;
        draft.me = action.result.user;
        break;
      }
      case LOAD_USER_FAILURE: {
        draft.loadingStates.isLoadingUser = false;
        break;
      }

      case LOGOUT: {
        draft.me = null;
        localStorage.removeItem("user");
        break;
      }

      default: {
        break;
      }
    }
  });
};
