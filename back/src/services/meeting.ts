import {MeetingModel, Agenda} from '../model/meeting';
import { UserModel, User } from '../model/user';
import { ObjectId } from 'bson';

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
