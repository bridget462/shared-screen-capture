const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("./public"));

app.get("/", (req, res) => {
  // create new room and redirect client
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  // pass roomId to client
  res.render("room-page", { roomId: req.params.room });
});

// socket event listeners
io.on("connection", (socket) => {
  // this function is called from client
  socket.on("join-room", (roomId, userId) => {
    console.log(roomId, userId);
  });
});

server.listen(3000);
