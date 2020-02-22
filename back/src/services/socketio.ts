/* eslint-disable @typescript-eslint/no-var-requires */
import socketIo from "socket.io";
import { jwtVerify } from "../utils/auth";
import { MeetingModel, Record } from "../model/meeting";
import { UserModel } from "../model/user";
import { ObjectId } from "bson";
import * as _ from "lodash";

const text = require('./api/text_analysis.js');


export const sendMeetingStateChangeEvent = (io: socketIo.Server, meetingId: string, state: 1 | 2) => {
  io.to(meetingId.toString()).emit('stateChange', 
    {
      type: 1, // 회의 상태 변경
      state
    }
  );
};

export const sendCurrentAgendaChangeEvnet = (
  io: socketIo.Server,
  meetingId: string,
  sequenceNumber: number
) => {
  io.to(meetingId.toString()).emit("stateChange", {
    type: 2, // 의제 변경
    sequenceNumberOfCurrentAgenda: sequenceNumber
  });
};

const sendOnlineUsersChangeEvent = (
  io: socketIo.Server,
  meetingId: string,
  onlineUsers: string[]
) => {
  io.to(meetingId.toString()).emit("stateChange", {
    type: 3, // 온라인 유저 변경
    onlineUsers
  });
};

const sendKeywordAddEvent = (
  io: socketIo.Server,
  meetingId: string,
  keywordToAdd: string
) => {
  io.to(meetingId.toString()).emit("stateChange", {
    type: 4, // 키워드 추가
    keywordToAdd
  });
};

type Entity = {name: string; type: string};
type Sentiment = {positive: number; negative: number; neutral: number};
type KeyPhrase = {id: number; keyPhrases: string[]};

const saveRecordAndAnalysis = async (meetingId: string, entities: Entity[], sentiment: Sentiment, record: Record) => {
  const meeting = await MeetingModel.findById(meetingId);
  if (!meeting) {
    return null;
  }
  const sequenceNumber = meeting.sequenceNumberOfCurrentAgenda;
  const newAgendas = _.cloneDeep(meeting.agendas);
  const {oldPositive, oldNegative, oldNeutral} = {
    oldPositive: newAgendas[sequenceNumber].sentiment?.positive || 0,
    oldNegative: newAgendas[sequenceNumber].sentiment?.negative || 0,
    oldNeutral: newAgendas[sequenceNumber].sentiment?.neutral || 0,
  };
  newAgendas[sequenceNumber].sentiment = {
    positive: oldPositive + sentiment.positive,
    negative: oldNegative + sentiment.negative,
    neutral: oldNeutral + sentiment.neutral,
  };
  for (let i = 0 ; i < entities.length ; i ++) {
    if (!newAgendas[sequenceNumber].entities) {
      newAgendas[sequenceNumber].entities = [];
    }
    const idx = newAgendas[sequenceNumber].entities.findIndex((entity) => entity.name === entities[i].name);
    if (idx !== -1) {
      newAgendas[sequenceNumber].entities[idx].weight = newAgendas[sequenceNumber].entities[idx].weight + 1;
    } else {
      newAgendas[sequenceNumber].entities.push({...entities[i], weight: 1});
    }
  }
  newAgendas[sequenceNumber].records.push(record);
  console.log(newAgendas);
  meeting.agendas = newAgendas;
  await meeting.save();
};


export const socketEventsInject = (io: socketIo.Server) => {
  type socketId = string;
  type userId = string;
  type meetingId = string;
  type talking = string;

  const socketEnterInfo = new Map<socketId, [userId, meetingId]>();
  const onlineUsers = new Map<meetingId, userId[]>();

  const rawTalkings = new Map<meetingId, [userId, talking]>();

  io.on("connection", socket => {
    socket.emit("connection-success", socket.id);

    socket.on("enter", async data => {
      const { meetingId, loginToken } = data;
      if (!meetingId || !loginToken) {
        return socket.emit("enter", {
          success: false,
          msg: "meetingId & loginToken needed"
        });
      }
      let decoded: any;
      try {
        decoded = jwtVerify(loginToken);
        if (!decoded.userId) {
          throw new Error("Wrong loginToken");
        }
      } catch (err) {
        return socket.emit("enter", { success: false, msg: err });
      }
      const meeting = await MeetingModel.findById(meetingId);
      if (!meeting) {
        return socket.emit("enter", { success: false, msg: "Wrong meetingId" });
      }
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        return socket.emit("enter", { success: false, msg: "Wrong meetingId" });
      }
      socket.join(meetingId);
      if (!rawTalkings.get(meetingId)) {
        rawTalkings.set(meetingId, ["", ""]);
      }
      const onlineUserIds = onlineUsers.get(meeting._id.toString());
      if (onlineUserIds) {
        onlineUsers.set(meeting._id.toString(), [
          ...onlineUserIds,
          user._id.toString()
        ]);
      } else {
        onlineUsers.set(meeting._id.toString(), [user._id.toString()]);
      }
      socketEnterInfo.set(socket.id, [user._id.toString(), meetingId]);
      sendOnlineUsersChangeEvent(io, meetingId, onlineUsers.get(meetingId)!);

      socket.emit("enter", { success: true });
    });

    socket.use((packet, next) => {
      if (!socketEnterInfo.get(socket.id) && packet[0] !== "enter") {
        next(new Error("Not entered"));
      } else {
        next();
      }
    });
    ///////////////////////////////////////////////////////////////

    socket.on("offer", data => {
      const enterInfo = socketEnterInfo.get(socket.id);
      socket.broadcast.to(enterInfo![1]).emit("offer", data.payload);
    });
    socket.on("answer", data => {
      const enterInfo = socketEnterInfo.get(socket.id);
      socket.broadcast.to(enterInfo![1]).emit("answer", data.payload);
    });
    socket.on("candidate", data => {
      const enterInfo = socketEnterInfo.get(socket.id);
      socket.broadcast.to(enterInfo![1]).emit("candidate", data.payload);
    });

    /////////////////////////////////////////////////////////////////

    socket.on("stateChange", data => {
      // 상태 변화 알림 relay
      const enterInfo = socketEnterInfo.get(socket.id);
      socket.broadcast.to(enterInfo![1]).emit("stateChange", data);
    });

    socket.on("talk", async (data) => {
      const [userId, meetingId] = socketEnterInfo.get(socket.id)!;
      console.log("aaaa");
      console.log(userId, meetingId);
      const lastTalkingInfo = rawTalkings.get(meetingId)!;
      if (!lastTalkingInfo[0]) {
        // 처음 대화 시작
        rawTalkings.set(meetingId, [userId, data.talking]);
        console.log(await text.getKeyphrase([data.talking]));
        io.to(meetingId).emit("talk", {
          speaker: userId,
          talking: data.talking,
          emphasize: (await text.getKeyphrase([data.talking]))?.[0].keyPhrases
        });
      } else if (lastTalkingInfo[0] === userId) {
        // 기존 화자가 이어서 말할 때
        const newTalking = lastTalkingInfo[1] + " " + data.talking;
        rawTalkings.set(meetingId, [userId, newTalking]);
        console.log(await text.getKeyphrase([newTalking]));
        console.log(typeof await text.getKeyphrase([newTalking]));
        io.to(meetingId).emit("talk", { speaker: userId, talking: newTalking,
          emphasize: (await text.getKeyphrase([newTalking]))?.[0].keyPhrases
        });
      } else {
        // 화자가 변경되었을 때
        const lastTalkingInfo = rawTalkings.get(meetingId)!;
        const entity: Entity[] = await text.getEntity([lastTalkingInfo[1]]);
        const sentiment: Sentiment[] = await text.getSentiment([lastTalkingInfo[1]]);
        const keyword: KeyPhrase[] = await text.getKeyphrase([lastTalkingInfo[1]]);
        console.log(entity);
        console.log(sentiment);
        console.log(keyword);
        for (let i = 0 ; i < entity.length ; i ++) {
          sendKeywordAddEvent(io, meetingId, entity[i].name);
        }
        const record: Record = {
          userId: new ObjectId(lastTalkingInfo[0]),
          sentence: lastTalkingInfo[1],
          keyPhrases: keyword[0].keyPhrases
        };
        await saveRecordAndAnalysis(meetingId, entity, sentiment[0], record);

        rawTalkings.set(meetingId, [userId, data.talking]);
        io.to(meetingId).emit("talk", {
          speaker: userId,
          talking: data.talking,
          emphasize: (await text.getKeyphrase([lastTalkingInfo[1]]))?.[0].keyPhrases
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      const enterInfo = socketEnterInfo.get(socket.id);
      if (enterInfo) {
        socket.broadcast.to(enterInfo![1]).emit("stateChange", {
          offline: enterInfo[0]
        });
        onlineUsers.set(
          enterInfo[1],
          onlineUsers
            .get(enterInfo[1])!
            .filter(existsUserId => existsUserId !== enterInfo[0])
        );
        sendOnlineUsersChangeEvent(
          io,
          enterInfo[1],
          onlineUsers.get(enterInfo[1])!
        );
      }
      socketEnterInfo.delete(socket.id);
    });
  });
};
