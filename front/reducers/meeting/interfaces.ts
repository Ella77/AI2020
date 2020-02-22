type agenda = {
  id: number;
  name: string;
  expectedTime: number; // ms
  usedTime: number; // ms
  startDate: Date;
  endDate: Date | null;
};

type meeting = {
  _id: string;
  name: string;
  agendas: agenda[];
  createdAt: string;
  updatedAt: string;
  state: number;
};

/* 로딩 상태 */
export interface loadingStates {
  isCreatingMeeting: boolean;
  isGetMeetings: boolean;
}

/* meta states */
export interface metaStates {}

type participant = {
  _id: string;
  loginId: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
};

export interface currentMeeting {
  sequenceNumberOfCurrentAgenda: number;
  agendas: agenda[];
  participants: participant[];
  state: number;
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface meetingStore {
  meeting: {
    meetings: currentMeeting[] | null;
    currentMeeting: currentMeeting | null;
    currentAgendas: agenda[] | null;
    lastPage: number;
  };
  metaStates: metaStates;
  loadingStates: loadingStates;
}
