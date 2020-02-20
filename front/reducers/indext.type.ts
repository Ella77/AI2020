import { userStore } from "./user/interfaces";
import { agendaStore } from "./agenda/index";

export type store = { agenda: agendaStore; user: userStore };
