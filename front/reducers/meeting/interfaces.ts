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
};

/* 로딩 상태 */
export interface loadingStates {
  isCreatingMeeting: boolean;
}

/* meta states */
export interface metaStates {}

export interface meetingStore {
  meeting: {
    meetings: meeting[] | null;
    currentMeeting: {
      id: string;
      name: string;
      agendas: agenda[];
    } | null;
    currentAgendas: agenda[] | null;
  };
  metaStates: metaStates;
  loadingStates: loadingStates;
}
