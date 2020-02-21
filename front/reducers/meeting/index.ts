import produce from "immer";
import { meetingStore } from "./interfaces";
import {
  MAKE_AGENDA,
  DELETE_AGENDA,
  CREATE_MEETING_REQUEST,
  CREATE_MEETING_SUCCESS,
  CREATE_MEETING_FAILURE,
  GET_MEETINGS_REQUEST,
  GET_MEETINGS_SUCCESS,
  GET_MEETINGS_FAILURE,
  GET_MY_MEETINGS_REQUEST,
  GET_MY_MEETINGS_SUCCESS,
  GET_MY_MEETINGS_FAILURE
} from "./actions";

const initialState: meetingStore = {
  meeting: {
    meetings: null,
    currentMeeting: {
      id: null,
      agendas: null,
      name: null
    },
    currentAgendas: []
  },
  loadingStates: {
    isCreatingMeeting: false
  },
  metaStates: {}
};

export default (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case MAKE_AGENDA: {
        draft.meeting.currentAgendas.push(action.payload);
        break;
      }
      case DELETE_AGENDA: {
        draft.meeting.currentAgendas = draft.meeting.currentAgendas.filter(
          agenda => agenda.id !== action.payload.id
        );
        break;
      }

      case CREATE_MEETING_REQUEST: {
        draft.loadingStates.isCreatingMeeting = true;
        break;
      }
      case CREATE_MEETING_SUCCESS: {
        draft.loadingStates.isCreatingMeeting = false;
        draft.meeting.currentMeeting.id = action.result;
      }
      case CREATE_MEETING_FAILURE: {
        draft.loadingStates.isCreatingMeeting = false;
        break;
      }

      case GET_MEETINGS_REQUEST: {
        break;
      }
      case GET_MEETINGS_SUCCESS: {
        draft.meeting.meetings = action.result;
        break;
      }
      case GET_MEETINGS_FAILURE: {
        break;
      }

      case GET_MY_MEETINGS_REQUEST: {
        break;
      }

      case GET_MY_MEETINGS_SUCCESS: {
        draft.meeting.meetings = action.result;

        break;
      }

      case GET_MY_MEETINGS_FAILURE: {
        break;
      }
      default: {
        break;
      }
    }
  });
};
