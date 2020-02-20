import { userStore } from "./user/interfaces";
import { meetingStore } from "./meeting/interfaces";

export type store = { meeting: meetingStore; user: userStore };
