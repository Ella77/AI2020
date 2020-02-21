import {MeetingModel, Meeting, Agenda} from '../model/meeting';
import { UserModel, User } from '../model/user';
import { ObjectId } from 'bson';
import {sendMeetingStateChangeEvent, sendCurrentAgendaChangeEvnet} from './socketio';
import {io} from '../../bin/www';
import * as _ from 'lodash';

/**
 * @description 이름과 안건들을 받아서 미팅 도큐먼트를 생성해 리턴함
 * @param name meeting 이름
 * @param agendas agendas 안건들
 * @return meeting 생성된 meeting 객체
 */
export const postMeeting = async (name: string, agendas: Agenda[]) => {
  return await MeetingModel.create({
    name,
    agendas
  });
};

/**
 * @description 미팅에 유저가 가입함. DB 모델에 필요한 수정을 해줌.
 * @param userId 유저 Id
 * @param meetingId 미팅 Id
 * @returns -1 userId나 meetingId에 해당하는 user meeting이 없을 경우
 * @retunrs -2 이미 meeting에 들어온 상태일 경우
 * @returns 0 성공했을 때
 */
export const enterMeeting = async (userId: ObjectId, meetingId: ObjectId) => {
  const user = await UserModel.findById(userId);
  const meeting = await MeetingModel.findById(meetingId);
  if (!user || !meeting) {
    return -1;
  }
  // 이미 가입했을 경우
  if ((user.meetings as ObjectId[]).findIndex((id: ObjectId) => {
    return id.toString() === meetingId.toString();
  }) !== -1) {
    return -2;
  } 

  (user.meetings as ObjectId[]).push(meetingId);
  (meeting.participants as ObjectId[]).push(userId);

  await meeting.save();
  await user.save();
  return 0;
};

/**
 * 
 * @param page 페이지 번호 1부터 시작, 기본 1개
 * @param perpage 페이지당 보여줄 개수, 기본 12개
 */
export const getMeetings = async (page = 1, perpage = 12) => {
  const query = MeetingModel.find();
  const lastPage = Math.ceil(((await query).length / perpage));
  const meetings = await query.skip((page -1) * perpage).limit(page * perpage)
    .populate({
      path: 'participants',
      select: '-encryptedPassword -meetings',
    });
  return {result: meetings, lastPage}; // (page-1) * perpage가 범위를 초과할 경우 빈 배열 반환함 
};

/**
 * 
 * @param userId meetings를 가져올 userId
 * @returns 
 */
export const getMeetingsByUser = async (userId: ObjectId) => {
  const user = await UserModel.findById(userId)
    .populate({
      path: 'meetings',
      populate: {
        path: 'participants',
        select: '-encryptedPassword -meetings'
      }
    });
  if (!user) {
    return -1;
  }
  return user.meetings as Meeting[];
};

/**
 * 
 * @param meetingId 가져올 meeting _id
 * @return meeting 성공시
 * @return -1 meetingId에 해당하는 meeting이 없을시
 */
export const getMeetingById = async (meetingId: ObjectId) => {
  const meeting = await MeetingModel.findById(meetingId)
    .populate({
      path: 'participants',
      select: '-encryptedPassword -meetings',
    });
  if (!meeting) {
    return -1;
  }
  return meeting;
};

/**
 * @param sequenceNumber 
 * @param meetingId 가져올 meeting _id
 * @return -1 meetingId에 해당하는 meeting이 없을시
 * @return 0 성공
 * @return 1 sequenceNumber가 0일때, 회의 시작 처리(첫 agenda 시작)
 * @return 2 agendas 범위를 넘어갔을 때, 회의 종료 처리
 */
export const updateSequenceNumber = async (meetingId: ObjectId, sequenceNumber: any) => {
  const meeting = await MeetingModel.findById(meetingId);
  if (!meeting) {
    return -1;
  }
  const nowDate = new Date();
  const sequenceNumberBeforeUpdate = meeting.sequenceNumberOfCurrentAgenda;
  const newAgendas: Agenda[] = _.cloneDeep(meeting.agendas);

  if (sequenceNumber === 0) { // 회의 시작
    meeting.state = 1;
    meeting.sequenceNumberOfCurrentAgenda = sequenceNumber;
    newAgendas[0].startDate = nowDate;

    meeting.agendas = newAgendas;
    await meeting.save();

    sendMeetingStateChangeEvent(io, meetingId.toString(), 1);
    return 1;
  }

  newAgendas[sequenceNumberBeforeUpdate] = {
    ...newAgendas[sequenceNumberBeforeUpdate],
    usedTime: (nowDate.getTime() - newAgendas[sequenceNumberBeforeUpdate].startDate.getTime()) / 1000,
    endDate: nowDate
  };
  meeting.sequenceNumberOfCurrentAgenda = sequenceNumber;

  if (newAgendas.length <= sequenceNumber) { // 회의 종료 처리
    meeting.state = 2;

    meeting.agendas = newAgendas;
    await meeting.save();

    sendMeetingStateChangeEvent(io, meetingId.toString(), 2);
    return 2;
  }

  newAgendas[meeting.sequenceNumberOfCurrentAgenda].startDate = nowDate;

  meeting.agendas = newAgendas;
  await meeting.save();
  sendCurrentAgendaChangeEvnet(io, meetingId.toString(), sequenceNumber);

  return 0;

};
