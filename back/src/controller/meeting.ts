import {wrapper} from '../utils/wrapper';
import validate = require('validate.js');
import * as meetingServices from '../services/meeting';

export const postMeeting = wrapper(async (req, res) => {
  const meeting = await meetingServices.postMeeting(req.body.agendas);

  return res.status(200).json({meeting: meeting._id});
});
