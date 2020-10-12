const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer(undefined, {
  host: "/",
  // TODO change port for deploy
  port: "3001",
});

const myVideo = document.createElement("video");
myVideo.muted = true;

// when client connected to peer server and get id, call this
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

navigator.mediaDevices.getDisplayMedia().then((stream) => {
  addVideoStream(myVideo, stream);
});

socket.on("user-connected", (userId) => {
  console.log("new user connected: ", userId);
});

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
