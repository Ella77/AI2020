import socketIo from 'socket.io';

export const handShakeForWebRTC = (io: socketIo.Server) => {

  const peers = io.of("/room");

  const connectedPeers = new Map();

  peers.on("connection", (socket) => {
    console.log(socket.id);

    socket.emit("connection-success", socket.id);

    connectedPeers.set(socket.id, socket);

    socket.on("disconnect", () => {
      console.log("disconnected");
      connectedPeers.delete(socket.id);
    });

    socket.on("offer", data => {
      for (const [socketID, socket] of connectedPeers.entries()) {
        if (socketID !== data.socketID) {
          console.log(socketID, data.payload.type);
          socket.emit("offer", data.payload);
        }
      }
    });
    socket.on("answer", data => {
      for (const [socketID, socket] of connectedPeers.entries()) {
        if (socketID !== data.socketID) {
          console.log(socketID, data.payload.type);
          socket.emit("answer", data.payload);
        }
      }
    });
    socket.on("candidate", data => {
      for (const [socketID, socket] of connectedPeers.entries()) {
        if (socketID !== data.socketID) {
          console.log("candidate", socketID);
          socket.emit("candidate", data.payload);
        }
      }
    });
  });
};
