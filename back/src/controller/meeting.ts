import {wrapper} from '../utils/wrapper';
import validate from 'validate.js';
import * as meetingServices from '../services/meeting';
import {ObjectId} from 'bson';
import { Meeting } from '../model/meeting';

export const postMeeting = wrapper(async (req, res) => {
  const input = {
    name: req.body.name,
    agendas: req.body.agendas
  };

  const invalid = validate(input, {
    name: {
      presence: true,
      type: 'string'
    },
    agendas: {
      presence: true,
      type: 'array'
    }
  });

  if (invalid) {
    return res.status(400).json({msg: invalid});
  }
  const startDate = new Date();
  for (let i = 0 ; i < (input.agendas as any[]).length ; i ++) {
    const keys = Object.keys(input.agendas[i]);
    for (let j = 0 ; j < keys.length ; j ++) {
      const key = keys[j];
      if (!(['name', 'expectedTime'].includes(key))) {
        return res.status(400).json({msg: 'Wrong agendas'});
      }
    }
    if (!validate.isString(input.agendas[i]['name']) || !validate.isNumber(input.agendas[i]['expectedTime'])) {
      return res.status(400).json({msg: 'Wrong agendas'});
    }
    input.agendas[i] = {
      ...input.agendas[i],
      startDate,
      records: [],
      usedTime: 0,
      endDate: null      
    };
  }

  const meeting = await meetingServices.postMeeting(input.name, input.agendas);
  await meetingServices.enterMeeting(req.user!._id, meeting._id); // 성공이 보장됨.
  return res.status(200).json({meeting: meeting._id});
});

export const enterMeeting = wrapper(async (req, res) => {
  const input = {
    meetingId: req.params.meetingId
  };
  const invalid = validate(input, {
    meetingId: {
      objectid: true
    }
  });
  if (invalid) {
    return res.status(400).json({msg: invalid});
  }

  const ret = await meetingServices.enterMeeting(req.user!._id, new ObjectId(input.meetingId));
  if ( ret === -1 ) {
    return res.status(404).json({msg: 'Meeting not found'});
  }
  if ( ret === -2 ) {
    return res.status(409).json({msg: 'Already entered in meeting'});
  }
  return res.status(200).json({success: true});
});

export const getEntireMeetings = wrapper(async (req, res) => {
  const input: any = {
    page: parseInt(req.query.page),
    perpage: parseInt(req.query.perpage)
  };
  Object.keys(input).forEach(key => !input[key] && delete input[key]);

  const invalid = validate(input, {
    page: {
      type: 'integer'
    },
    perpage: {
      type: 'integer'
    }
  });
  if (invalid) {
    return res.status(400).json({msg: invalid});
  }
  const result = await meetingServices.getMeetings(input.page, input.perpage);
  res.status(200).json(result);
});

export const getMyMeetings = wrapper(async (req, res) => {
  const result = await meetingServices.getMeetingsByUser(req.user._id) as Meeting[];
  res.status(200).json({result});
});

export const getMeetingById = wrapper(async (req, res) => {
  const input = {
    meetingId: req.params.meetingId
  };

  const invalid = validate(input, {
    meetingId: {
      objectid: true
    }
  });
  if (invalid) {
    return res.status(400).json({msg: invalid});
  }

  const meeting = await meetingServices.getMeetingById(new ObjectId(input.meetingId));
  if (meeting === -1) {
    return res.status(404).json({msg: 'Meeting not found'});
  }
  res.status(200).json({result: meeting});
});
