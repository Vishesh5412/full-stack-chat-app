import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io({
      path: "/api/socket", // Must match the server
    });
  }
  return socket;
};
