import mongoose from 'mongoose';
import { ObjectId } from 'bson';

export type Agenda = {
  name: string;
  records: string[];
};

export interface Meeting extends mongoose.Document {
  agendas: Agenda[];
}

const schema = new mongoose.Schema({
  agendas: {
    default: [],
    type: [mongoose.Schema.Types.Mixed]
  }
}, {
  timestamps: true
});

export const MeetingModel = mongoose.model<Meeting>('Meeting', schema);
