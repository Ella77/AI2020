import produce from "immer";
import { MAKE_AGENDA, DELETE_AGENDA, MAKE_CONFERENCE } from "./actions";

type agenda = {
  name: string;
  expectedTime: number; // ms
  usedTime: number; // ms
  startDate: Date;
  endDate: Date | null;
};

type meeting = {
  name: string;
  agendas: agenda[];
};

export interface agendaStore {
  meetings: meeting[];
  currentMeeting: meeting;
  currentAgendas: agenda[];
}

const initialState: agendaStore = {
  meetings: [],
  currentMeeting: {
    name: "",
    agendas: []
  },
  currentAgendas: []
};

export default (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case MAKE_CONFERENCE: {
        draft.meetings = action.payload;
        break;
      }
      case MAKE_AGENDA: {
        draft.currentAgendas.push(action.payload);
        break;
      }
      case DELETE_AGENDA: {
        draft.currentAgendas = draft.currentMeeting.agendas.filter(
          agenda => agenda.name !== action.payload.name
        );
        break;
      }

      default: {
        break;
      }
    }
  });
};
