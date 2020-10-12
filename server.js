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
  res.render("room", { roomId: req.params.room });
});

server.listen(3000);
