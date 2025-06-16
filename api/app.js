import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const corsOptions = {
  origin: process.env.CLIENT_URL, // Replace with your client domain
  credentials: true, // Allow credentials such as cookies or authorization headers
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  //allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("Server is running!");
});

// server.js

// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";

// // Load environment variables from .env
// dotenv.config();

// // Create express app and HTTP server
// const app = express();
// const httpServer = createServer(app);

// // Allowed origins for frontend
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://realestate-frontend-blond.vercel.app",
//   "https://realestate-de24.vercel.app",
// ];

// // CORS middleware for Express routes
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(cookieParser());

// // ================= Routes =================
// import authRoute from "./routes/auth.route.js";
// import postRoute from "./routes/post.route.js";
// import testRoute from "./routes/test.route.js";
// import userRoute from "./routes/user.route.js";
// import chatRoute from "./routes/chat.route.js";
// import messageRoute from "./routes/message.route.js";

// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/posts", postRoute);
// app.use("/api/test", testRoute);
// app.use("/api/chats", chatRoute);
// app.use("/api/messages", messageRoute);

// app.get("/", (req, res) => {
//   res.send("✅ API + Socket.IO server is running...");
// });

// // ================= Socket.IO =================
// const io = new Server(httpServer, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// let onlineUsers = [];

// const addUser = (userId, socketId) => {
//   const exists = onlineUsers.some((user) => user.userId === userId);
//   if (!exists) {
//     onlineUsers.push({ userId, socketId });
//     console.log(`✅ User connected: ${userId} (${socketId})`);
//   }
// };

// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
//   console.log(`❌ Socket disconnected: ${socketId}`);
// };

// const getUser = (userId) => {
//   return onlineUsers.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   console.log(`📡 New socket connected: ${socket.id}`);

//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//     console.log("👥 Online users:", onlineUsers);
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
//     console.log("🟡 Online users after disconnect:", onlineUsers);
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 8800;
// httpServer.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });
