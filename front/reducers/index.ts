import { combineReducers } from "redux";
import axios from "axios";
import agenda from "./agenda";
import user from "./user";
import { backend_server } from "../config/api";

axios.defaults.baseURL = backend_server.base_url;

const rootReducer = combineReducers({ agenda, user });

export default rootReducer;
