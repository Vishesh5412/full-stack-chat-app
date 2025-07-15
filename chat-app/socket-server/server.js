const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Socket server is live ");
});

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

let userIdToSocket = new Map();
let socketIdToUser = new Map();

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("user-connected", (authId) => {
    userIdToSocket.set(authId, socket.id);
    socketIdToUser.set(socket.id, authId);
    io.emit("online-users", Array.from(userIdToSocket.keys()));
  });

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`📦 Joined room: ${roomId}`);
  });

  socket.on("send-message", ({ roomId, message }) => {
    if (roomId === "global-room") {
      io.to(roomId).emit("globalMessage", message);
    } else {
      io.to(roomId).emit("newMessage", message);
    }
  });

  socket.on("disconnect", () => {
    const userId = socketIdToUser.get(socket.id);
    if (userId) {
      userIdToSocket.delete(userId);
      socketIdToUser.delete(socket.id);
    }
    io.emit("online-users", Array.from(userIdToSocket.keys()));
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log(" Socket server running on port 5000");
});

// **socket.on=> server side=>  listen for events triggered by client
// **io.to=> server side => to send message to all users connected to room(paramter)
// **socket.emit =>clientside => to send message too all users connected to room(paramter)
