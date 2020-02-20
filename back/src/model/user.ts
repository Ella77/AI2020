import mongoose from 'mongoose';
import { ObjectId } from 'bson';
import { Meeting } from './meeting';

export interface User extends mongoose.Document {
  loginId: string;
  encryptedPassword: string;
  nickname: string;
  meetings: Meeting[] | ObjectId[];

  socketId: string | null; // online이면 string, offline이면 null
}

const schema = new mongoose.Schema({
  loginId: {
    required: true,
    type: String
  },
  encryptedPassword: {
    required: true,
    type: String
  },
  nickname: {
    required: true,
    type: String
  },
  meetings: {
    default: [],
    type: [{
      type: ObjectId,
      ref: 'Meeting'
    }]
  },
  socketId: {
    type: String
  }
}, {
  timestamps: true
});

export const UserModel = mongoose.model<User>('User', schema);
