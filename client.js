const io = require("socket.io-client");

const socket = io("http://localhost:5000");

const user_id = "6a05edf6250a5f170c788028";

socket.on("connect", () => {

  console.log(" Connected to server");


  socket.emit("join_user_room", user_id);

  console.log(" Joined room:", user_id);
});


socket.on("fraud_alert", (data) => {

  console.log(" FRAUD ALERT RECEIVED");

  console.log(data);
});


socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});