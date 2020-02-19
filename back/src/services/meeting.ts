import {MeetingModel, Agenda} from '../model/meeting';

export const postMeeting = async (agendas: Agenda[]) => {
  return await MeetingModel.create({
    agendas
  });
};
