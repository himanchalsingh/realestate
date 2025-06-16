// import { config } from "dotenv";
// import { Server } from "socket.io";

// // Load environment variables from .env
// config();

// const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
// const PORT = process.env.PORT || 5550;

// const io = new Server({
//   cors: {
//     origin: CLIENT_URL,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// let onlineUsers = [];

// /**
//  * Adds a user to the online users list.
//  * Removes existing duplicate entries (for multi-tab cases).
//  */
// const addUser = (userId, socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
//   onlineUsers.push({ userId, socketId });
// };

// /** Removes a user by their socket ID. */
// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
// };

// /** Gets a user object by their user ID. */
// const getUser = (userId) => {
//   return onlineUsers.find((user) => user.userId === userId);
// };

// // Main Socket.IO connection logic
// io.on("connection", (socket) => {
//   console.log(`✅ Socket connected: ${socket.id}`);

//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//     console.log(`👤 New user added: ${userId}`);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     if (receiver) {
//       io.to(receiver.socketId).emit("getMessage", data);
//       console.log(`📩 Message sent to ${receiverId}`);
//     } else {
//       console.log(`⚠️ User ${receiverId} not found online`);
//     }
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//     console.log(`❌ Socket disconnected: ${socket.id}`);
//   });
// });

// // Start the server
// io.listen(PORT, () => {
//   console.log(
//     `🚀 Socket.IO server running at http://localhost:${PORT}, allowing origin: ${CLIENT_URL}`
//   );
// });
// socket-server.js
import { config } from "dotenv";
import { Server } from "socket.io";

// Load .env variables
config();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const PORT = process.env.PORT || 5550;

const io = new Server({
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  // Remove duplicates and add
  onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
  onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log(`👤 New user added: ${userId}`);
    console.log("🟢 Online users:", onlineUsers);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
      console.log(`📨 Sent to ${receiverId}:`, data);
    } else {
      console.log(`⚠️ Receiver ${receiverId} not online`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);
    removeUser(socket.id);
    console.log("🟡 Online users after disconnect:", onlineUsers);
  });
});

io.listen(PORT, () => {
  console.log(
    `🚀 Socket.IO running on http://localhost:${PORT} (origin allowed: ${CLIENT_URL})`
  );
});
