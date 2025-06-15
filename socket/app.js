// import { Server } from "socket.io";
// const io = new Server({
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// let onlineUser = [];

// const addUser = (userId, socketId) => {
//   const userExits = onlineUser.find((user) => user.userId === userId);
//   if (!userExits) {
//     onlineUser.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return onlineUser.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     io.to(receiver.socketId).emit("getMessage", data);
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });

// io.listen("4000");

import { Server } from "socket.io";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];

// Add user if not already present
const addUser = (userId, socketId) => {
  const exists = onlineUsers.some((user) => user.userId === userId);
  if (!exists) {
    onlineUsers.push({ userId, socketId });
    console.log(`✅ User connected: ${userId} (${socketId})`);
  }
};

// Remove user by socketId
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  console.log(`❌ Socket disconnected: ${socketId}`);
};

// Get user by userId
const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log(`📡 New socket connected: ${socket.id}`);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log("👥 Current online users:", onlineUsers);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver?.socketId) {
      io.to(receiver.socketId).emit("getMessage", data);
      console.log(`📨 Message sent to ${receiverId}:`, data);
    } else {
      console.warn(`⚠️ User ${receiverId} is not online`);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("🟡 Updated online users:", onlineUsers);
  });
});

const PORT = process.env.PORT || 4000;
io.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
});
