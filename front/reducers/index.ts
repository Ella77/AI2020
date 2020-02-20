import { combineReducers } from "redux";
import axios from "axios";
import meeting from "./meeting";
import user from "./user";
import { backend_server } from "../config/api";

axios.defaults.baseURL = backend_server.base_url;

const rootReducer = combineReducers({ meeting, user });

export default rootReducer;
