import mongoose from 'mongoose';
import { ObjectId } from 'bson';
import { User } from './user';

export type Record = {
  userId: ObjectId | User;
  sentence: string;
}

export type Keyword = {
  word: string;
  comeup: number;
}

export type Search = {
  name: string;
  type: string;
  comeup: number;

}
export type MeetingState = 0 | 1 | 2 // 0 회의 시작 이전, 1 회의 진행중, 2 회의 종료

export type Agenda = {
  name: string;
  
  expectedTime: number; // minute
  usedTime: number; // second

  startDate: Date;
  endDate: Date | null;
  
  records: Record[];
  keywords: Keyword[];
  searches : Search[];
};

export interface Meeting extends mongoose.Document {
  name: string;
  sequenceNumberOfCurrentAgenda: number; // 현재 논의 중인 의제, 0부터 시작
  agendas: Agenda[];
  participants: ObjectId[] | User[];
  state: MeetingState;
}

const schema = new mongoose.Schema({
  name: {
    type: String
  },
  sequenceNumberOfCurrentAgenda: {
    default: 0,
    type: Number
  },
  agendas: {
    default: [],
    type: [mongoose.Schema.Types.Mixed]
  },
  participants: {
    default: [],
    type: [{
      type: ObjectId,
      ref: 'User'
    }]
  },
  state: {
    default: 0,
    type: Number
  }
}, {
  timestamps: true
});

export const MeetingModel = mongoose.model<Meeting>('Meeting', schema);
