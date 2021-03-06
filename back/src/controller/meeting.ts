import {wrapper} from '../utils/wrapper';
import validate from 'validate.js';
import * as meetingServices from '../services/meeting';
import {ObjectId} from 'bson';
import { Meeting } from '../model/meeting';
import {sendCurrentAgendaChangeEvnet} from '../services/socketio';
import { io } from '../../bin/www';

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
      expectedTime: input.agendas[i].expectedTime * 60,
      records: [],
      usedTime: 0,
      endDate: null,

      entities: [],
      sentiment: {
        positive: 0,
        negative: 0,
        neutral: 0,
      }
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

export const updateSequenceNumber = wrapper(async (req, res) => {
  const input = {
    meetingId: req.params.meetingId,
    sequenceNumber: parseInt(req.body.sequenceNumber)
  };

  const invalid = validate(input, {
    meetingId: {
      objectid: true
    },
    sequenceNumber: {
      presence: true,
      type: 'number'
    }
  });
  if (invalid) {
    return res.status(400).json({msg: invalid});
  }
  const meeting = await meetingServices.updateSequenceNumber(new ObjectId(input.meetingId), input.sequenceNumber);
  if (meeting === -1) {
    return res.status(404).json({msg: 'Meeting not found'});
  }
  return res.status(200).json({success: true});
});


export const Deepsearch = wrapper(async (req, res) => {
  const input = {
    name: req.params.name,
    type : req.params.type
  };

  const invalid = validate(input, {
    name: {
      presence: true,
      type: 'string'
    },
    type: {
      presence: true,
      type: 'string'
    },
  });
  if (invalid) {
    return res.status(400).json({msg: invalid});
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const entity= require('../services/api/entity.js');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const image = require('../services/api/image.js');
  const result = [];
  if (input.type=='Location'){
    try {
      result.push({"imageurls":image.getImage(name)});
    }
    catch{
      result.push({"imageurls":NaN});
    }
    try {
      result.push({"description":entity.getDescription(name)});
    }
    catch{
      result.push({"description":NaN});
    }
    try{
      result.push({"islocation":entity.getLocation(name)});
    }
    catch{
      result.push({"islocation":NaN});
    }
  }
  if (input.type=='Person' || 'Organization') {
    try {
      result.push(entity.getDescription(name));
    }
    catch{
      result.push({"description":NaN});
    }
    try {
      result.push({"imageurls":image.getImage(name)});
    }
    catch{
      result.push({"imageurls":NaN});
    }

  }
  res.status(200).json({result: result});
});