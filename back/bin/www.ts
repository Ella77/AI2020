/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * Module dependencies.
 */

import app from "../src/app";
import https from "https";
import socketIo from "socket.io";
import { socketEventsInject } from "../src/services/socketio";
import fs from 'fs';

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "4000");

app.set("port", port);

/**
 * Create HTTP server.
 */

const options = {
  key: fs.readFileSync('../certificates/private.key', 'utf8'),
  cert: fs.readFileSync('../certificates/certificate.crt', 'utf8')
};

const server = https.createServer(options, app);
const io = socketIo(server, { pingTimeout: 60000 });
export { io };
socketEventsInject(io);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
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
