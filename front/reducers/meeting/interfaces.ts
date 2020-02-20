type agenda = {
  id: number;
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

/* 로딩 상태 */
export interface loadingStates {
  isCreatingMeeting: boolean;
}

/* meta states */
export interface metaStates {}

export interface meetingStore {
  meeting: {
    meetings: meeting[] | null;
    currentMeeting: meeting | null;
    currentAgendas: agenda[] | null;
  };
  metaStates: metaStates;
  loadingStates: loadingStates;
}
