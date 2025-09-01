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

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

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

const TIC_TAC_TOE = io.of("/tic-tac-toe");

TIC_TAC_TOE.on("connection", (socket) => {

  // join room
  const roomToJoin = room_join(TIC_TAC_TOE.adapter.rooms, RoomsIndex);
  
  socket.join(`${roomToJoin}`);
  
  // Console logs
  console.log(TIC_TAC_TOE.adapter.rooms, "all rooms");
  console.log(TIC_TAC_TOE.adapter.rooms.size, "amount of rooms");
  console.log(TIC_TAC_TOE.adapter.rooms.get("room1")?.size, "size of room1");
  console.log(TIC_TAC_TOE.adapter.sids.size, "Number of sockets");
  console.log(socket.rooms, "rooms the socket is joined to");
  
  // Board logic
  // let Board = {
  //   one: "",
  //   two: "",
  //   three: "",
  //   four: "",
  //   five: "",
  //   six: "",
  //   seven: "",
  //   eight: "",
  //   nine: "",
  // }
  socket.on("player-move", (board) => {
    TIC_TAC_TOE.to(`${roomToJoin}`).emit("player-move", board);
  })

  socket.on("play-again", (again) => {
    TIC_TAC_TOE.to(`${roomToJoin}`).emit("play-again", again)
  })
  
  // On received event
  socket.on("send-message", (arrayOfMessages) => {
    fullChat.push(arrayOfMessages);
    console.log(arrayOfMessages, "messages");
    TIC_TAC_TOE.to(`${roomToJoin}`).emit("send-message", fullChat);
  });
  
  // Disconnected
  socket.on("disconnect", () => {
    fullChat = [];
    TIC_TAC_TOE.to(`${roomToJoin}`).emit("send-message", fullChat);
    console.log("disconnected");
    console.log(TIC_TAC_TOE.adapter.rooms, "all rooms");
    console.log(TIC_TAC_TOE.adapter.rooms.size, "amount of rooms");
  });
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
httpserver.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
