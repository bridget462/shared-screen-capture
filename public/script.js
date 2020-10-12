const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer(undefined, {
  host: "/",
  // TODO change port for deploy
  port: "3001",
});

const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = [];

// when client connected to peer server and get id, call this
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

// TODO change to screen capture stream
navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then((stream) => {
    // adding own video stream to own page
    addVideoStream(myVideo, stream);

    // responding other user's request and sending my video
    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // sharing own stream to new user which connected to the same room
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

socket.on("user-connected", (userId) => {
  console.log("new user connected: ", userId);
});

socket.on("user-disconnected", (userId) => {
  console.log("user-disconnected: ", userId);
  if (peers[userId]) {
    peers[userId].close();
  }
});

function connectToNewUser(userId, stream) {
  // sending my video to other user
  const call = myPeer.call(userId, stream);
  // receiving other video
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
