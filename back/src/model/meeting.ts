import mongoose from 'mongoose';
import { ObjectId } from 'bson';
import { User } from './user';

export type Record = {
  userId: ObjectId | User;
  sentence: string;
}

export type Agenda = {
  name: string;
  
  expectedTime: number; // ms
  usedTime: number; // ms

  startDate: Date;
  endDate: Date | null;
  
  records: Record[];
};

export interface Meeting extends mongoose.Document {
  name: string;
  sequenceNumberOfCurrentAgenda: number; // 현재 논의 중인 의제, 0부터 시작
  agendas: Agenda[];
  participants: ObjectId[] | User[];
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
  }
}, {
  timestamps: true
});

export const MeetingModel = mongoose.model<Meeting>('Meeting', schema);
