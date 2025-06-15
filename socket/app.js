// import { config } from "dotenv"; // Import dotenv for environment variable support
// import { Server } from "socket.io"; // Import Server from socket.io

// // Load environment variables from .env
// config();

// // Setup CORS and other options for Socket.io
// const io = new Server({
//   cors: {
//     origin: "http://localhost:5173", // Adjust this for your frontend URL
//   },
// });

// // Use process.env.PORT with a fallback to 4000 for local development
// const PORT = process.env.PORT || 5550;

// let onlineUser = []; // Store all connected users

// // Function to add a user to the online user list
// const addUser = (userId, socketId) => {
//   const userExists = onlineUser.find((user) => user.userId === userId);
//   if (!userExists) {
//     onlineUser.push({ userId, socketId });
//   }
// };

// // Function to remove a user from the online user list
// const removeUser = (socketId) => {
//   onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
// };

// // Function to get a user by userId
// const getUser = (userId) => {
//   return onlineUser.find((user) => user.userId === userId);
// };

// // Handle socket.io connections
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   // Add new user when they connect
//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//   });

//   // Handle sending messages
//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     if (receiver) {
//       io.to(receiver.socketId).emit("getMessage", data);
//     }
//   });

//   // Remove user on disconnect
//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
//     removeUser(socket.id);
//   });
// });

// // Listen on the port from .env or default to 4000
// io.listen(PORT, () => {
//   console.log(`Socket server is running on port ${PORT}`);
// });

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

// import { Server } from "socket.io";
// import dotenv from "dotenv";
// const express = require("express");
// const cors = require("cors");
// // Load environment variables from .env file
// dotenv.config();
// const allowedorigins = [
//   "http://localhost:5173",
//   "https://realestate-de24.vercel.app",
// ];
// const io = new Server({
//   cors: {
//     origin: allowedorigins,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   },
// });

// let onlineUsers = [];

// // Add user if not already present
// const addUser = (userId, socketId) => {
//   const exists = onlineUsers.some((user) => user.userId === userId);
//   if (!exists) {
//     onlineUsers.push({ userId, socketId });
//     console.log(`✅ User connected: ${userId} (${socketId})`);
//   }
// };

// // Remove user by socketId
// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
//   console.log(`❌ Socket disconnected: ${socketId}`);
// };

// // Get user by userId
// const getUser = (userId) => {
//   return onlineUsers.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   console.log(`📡 New socket connected: ${socket.id}`);

//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//     console.log("👥 Current online users:", onlineUsers);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     if (receiver?.socketId) {
//       io.to(receiver.socketId).emit("getMessage", data);
//       console.log(`📨 Message sent to ${receiverId}:`, data);
//     } else {
//       console.warn(`⚠️ User ${receiverId} is not online`);
//     }
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//     console.log("🟡 Updated online users:", onlineUsers);
//   });
// });

// const PORT = process.env.PORT || 4000;
// io.listen(PORT, () => {
//   console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
// });

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = createServer(app); // <-- use this with Socket.IO

const allowedOrigins = [
  "http://localhost:5173",
  "https://realestate-frontend-blond.vercel.app", // your frontend vercel
  "https://realestate-de24.vercel.app", // if still used
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ===== Socket Logic =====
let onlineUsers = [];

const addUser = (userId, socketId) => {
  const exists = onlineUsers.some((user) => user.userId === userId);
  if (!exists) {
    onlineUsers.push({ userId, socketId });
    console.log(`✅ User connected: ${userId} (${socketId})`);
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  console.log(`❌ Socket disconnected: ${socketId}`);
};

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
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("🟡 Updated online users:", onlineUsers);
  });
});

// ==== HTTP routes if needed ====
app.get("/", (req, res) => {
  res.send("Socket.IO Server is Running...");
});

// ==== Start Server ====
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
