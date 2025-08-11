require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth-route");
const { Server } = require("socket.io");
const http = require("http");

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

io.on("connection", (socket) => {
    RoomsIndex++;
    socket.join(`room${RoomsIndex}`);


    if(RoomsIndex > 1) socket.join([`room${RoomsIndex}`, `room${RoomsIndex - 1}`]);

    console.log(io.sockets.adapter.rooms, "all rooms");
    console.log(io.sockets.adapter.rooms.size, "amount of rooms");
    console.log(io.sockets.adapter.rooms.get("room1").size, "size of room1");

    socket.emit("user-joined", "hello");

    console.log(io.sockets.adapter.sids.size, "Number of sockets");

    socket.on("send-message", (arrayOfMessages) => {
      fullChat.push(arrayOfMessages);
      console.log(arrayOfMessages, "messages");
      io.to("room1").emit("send-message", fullChat);
    })

    socket.on("disconnect", () => {
      RoomsIndex--;
      io.to("room1").emit("receive-chat", fullChat);
      console.log("disconnected");
    })
})


const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));
httpserver.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));