// import express from "express";
// import path from "path";
// import dotenv from "dotenv";
// dotenv.config();
// import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
// import userRoutes from "./routes/userRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// import tokenRoute from "./routes/tokenRoute.js";
// import conversationRoutes from "./routes/conversationRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";

// import connectDB from "./config/db.js";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// // import socket from "socket.io";
// import { Server } from "socket.io";

// import http from "http";

// const port = process.env.PORT || 5000;

// connectDB();

// const httpServer = http.createServer();
// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(cookieParser());

// app.use("/users", userRoutes);
// app.use("/products", productRoutes);
// app.use("/orders", orderRoutes);
// app.use("/payments", paymentRoutes);
// app.use("/token", tokenRoute);
// app.use("/conversations", conversationRoutes);
// app.use("/messages", messageRoutes);

// app.get("/", (req, res) => {
//   res.send("Server is ready");
// });

// app.use(notFound);
// app.use(errorHandler);

// const server = app.listen(port, () =>
//   console.log(`Server started on port ${port}`)
// );

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// let users = [];

// const addUser = (userId, socketId) => {
//   !users.some((user) => user.userId === userId) &&
//     users.push({ userId, socketId });
// };

// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return users.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   // when connect
//   console.log("New client connected");
//   //   take userId and socketId from user
//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//     console.log("User added to the system:", userId);
//     io.emit("getUsers", users);
//   });

//   //   send and get message
//   socket.on("sendMessage", ({ senderId, receiverId, text }) => {
//     const user = getUser(receiverId);
//     console.log(user);
//     io.to(user?.socketId).emit("getMessage", {
//       senderId,
//       text,
//     });
//   });

//   //   when disconnect
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//     removeUser(socket.id);
//     io.emit("getUsers", users);
//   });
// });

import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import houseRoutes from "./routes/houseRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import tokenRoute from "./routes/tokenRoute.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import socket from "socket.io";
import { Server } from "socket.io";

import http from "http";
import { sendUnreadMessageReminders } from "./utils/notification.js";
import schedule from "node-schedule";

const port = process.env.PORT || 5000;

connectDB();

const httpServer = http.createServer();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

//Rate limiting

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 100, // limit each IP to 100 requests per windowMs

  message: "Too many requests from this IP, please try again later.",
});

// app.use("/users", limiter);

//Data sanitization against No-sql query injection

// app.use(mongoSanitize());

//Data sanitization against XSS attacks

// app.use(xss());

app.use("/users", userRoutes);
app.use("/houses", houseRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/token", tokenRoute);
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // when connect
  console.log("New client connected");
  //   take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    console.log("User added to the system:", userId);
    io.emit("getUsers", users);
  });

  //   send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log(user);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //   when disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// const job = schedule.scheduleJob("0 8 * * *", async () => {
//   // Runs once a day at 8:00 AM
//   try {
//     await sendUnreadMessageReminders();
//     console.log("Sent upcoming task notifications");
//   } catch (error) {
//     console.error("Error sending upcoming task notifications:", error);
//   }
// });

// const job = schedule.scheduleJob("* * * * *", async () => {
//   // Runs every minute
//   try {
//     await sendUnreadMessageReminders();
//     // console.log("Sent upcoming task notifications");
//   } catch (error) {
//     // console.error("Error sending upcoming task notifications:", error);
//   }
// });

export { app, server }; // Export both app and server if needed
