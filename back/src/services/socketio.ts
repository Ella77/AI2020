import socketIo from 'socket.io';
import {jwtVerify} from '../utils/auth';
import { MeetingModel } from '../model/meeting';
import { UserModel } from '../model/user';
import {ObjectId} from 'bson';

export const handShakeForWebRTC = (io: socketIo.Server) => {

  type socketId = string;
  type userId = string;
  type meetingId = string;

  const socketEnterInfo = new Map<socketId, [userId, meetingId]>();

  io.on("connection", (socket) => {
    socket.emit("connection-success", socket.id);

    socket.on('enter', async (data) => {
      const {meetingId, loginToken} = data;
      if (!meetingId || !loginToken) {
        return socket.emit('enter', {success: false, msg: 'meetingId & loginToken needed'});
      }
      let decoded: any;
      try {
        decoded = jwtVerify(loginToken);
        if (!decoded.userId) {
          throw new Error('Wrong loginToken');
        }
      } catch (err) {
        return socket.emit('enter', {success: false, msg: err});
      }
      const meeting = await MeetingModel.findById(meetingId);
      if (!meeting) {
        return socket.emit('enter', {success: false, msg: 'Wrong meetingId'});
      }
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        return socket.emit('enter', {success: false, msg: 'Wrong meetingId'});
      }
      socket.join(meetingId);
      socketEnterInfo.set(socket.id, [user._id.toString(), meetingId._id.toString()]);
      socket.emit('enter', {success: true});
    });

    socket.use((packet, next) => {
      console.log(!socketEnterInfo.get(socket.id));
      console.log(packet[0] !== 'enter');
      if (!socketEnterInfo.get(socket.id) && packet[0] !== 'enter') {
        console.log(1);
        next(new Error('Not entered'));
      } else {
        next();
      }
    });
    ///////////////////////////////////////////////////////////////

    socket.on("offer", data => {
      const enterInfo = socketEnterInfo.get(socket.id);
      socket.broadcast.to(enterInfo![1]).emit('offer', data.payload);
    });
    socket.on("answer", data => {
      const enterInfo = socketEnterInfo.get(socket.id);
      socket.broadcast.to(enterInfo![1]).emit('answer', data.payload);
    });
    socket.on("candidate", data => {
      const enterInfo = socketEnterInfo.get(socket.id);
      socket.broadcast.to(enterInfo![1]).emit('candidate', data.payload);
    });

    /////////////////////////////////////////////////////////////////

    socket.on('stateChange', data => { // 상태 변화 알림 relay
      const enterInfo = socketEnterInfo.get(socket.id);
      socket.broadcast.to(enterInfo![1]).emit('stateChange', data);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
      const enterInfo = socketEnterInfo.get(socket.id);
      if (enterInfo) {
        socket.broadcast.to(enterInfo![1]).emit('stateChange', {
          'offline': enterInfo[0]
        });
      }
      socketEnterInfo.delete(socket.id);
    });
  });
};
