require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth-route");
const { Server } = require("socket.io");
const http = require("http");
const room_join = require("./scripts/rooms.js");

const app = express();
require("./database");

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api", authRouter);

const httpserver = http.createServer(app);

const io = new Server(httpserver, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

let RoomsIndex = 0;

let fullChat = [];


// Connection
io.on("connection", (socket) => {
  
  let roomToJoin = room_join(io.sockets.adapter.rooms, RoomsIndex);
  
  if(roomToJoin) socket.join(`${roomToJoin}`);
  else socket.join(`room${++RoomsIndex}`);
  
  // Console logs
  console.log(io.sockets.adapter.rooms, "all rooms");
  console.log(io.sockets.adapter.rooms.size, "amount of rooms");
  console.log(io.sockets.adapter.rooms.get("room1")?.size, "size of room1");
  
  // Emits
  socket.emit("user-joined", "hello");
  
  console.log(io.sockets.adapter.sids.size, "Number of sockets");
  
  // Ons
  socket.on("send-message", (arrayOfMessages) => {
    fullChat.push(arrayOfMessages);
    console.log(arrayOfMessages, "messages");
    io.to("room1").emit("send-message", fullChat);
  });
  
  // Disconnected
  socket.on("disconnect", () => {
    io.to("room1").emit("receive-chat", fullChat);
    console.log("disconnected");
    console.log(io.sockets.adapter.rooms, "all rooms");
    console.log(io.sockets.adapter.rooms.size, "amount of rooms");
    console.log(io.sockets.adapter.rooms.get("room1")?.size, "size of room1");
  });
  console.log(socket.rooms);
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
httpserver.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
