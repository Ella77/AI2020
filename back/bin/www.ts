/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * Module dependencies.
 */

import app from "../src/app";
import http from "http";
import { Socket } from "socket.io";

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "4000");

app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

const a = server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr!.port;
  console.log("Listening on " + bind);
}

// socket

const io = require("socket.io")({ path: "/room" });
io.listen(a);
const peers = io.of("/room");

let connectedPeers = new Map();

peers.on("connection", (socket: Socket) => {
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
