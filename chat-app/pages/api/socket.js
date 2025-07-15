import { Server } from "socket.io";

let io;
let userIdToSocket = new Map();
let socketIdToUser = new Map();
export default function handler(req, res) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // socket.on used on server side to listen for events triggered by client
      socket.on("user-connected", (authId) => {
        userIdToSocket.set(authId, socket.id);
        socketIdToUser.set(socket.id, authId);
        //io.emit is used to trigger event and send to all clients
        //socket.emit is used to trigger and send to only the current client
        //socket.broadcase.emit->all except the client
        io.emit("online-users", Array.from(userIdToSocket.keys()));
      });

      socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`Joined room: ${roomId}`);
      });

      socket.on("send-message", ({ roomId, message }) => {
        io.to(roomId).emit("newMessage", message);
      });

      socket.on("disconnect", () => {
        const userId = socketIdToUser.get(socket.id);
        if (userId) {
          userIdToSocket.delete(userId);
          socketIdToUser.delete(socket.id);
        }
        io.emit("online-users", Array.from(userIdToSocket.keys()));
        console.log(" Client disconnected");
      });
    });

    res.socket.server.io = io;
    console.log("Socket.IO server initialized");
  }

  res.end();
}
