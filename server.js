const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const socketHandler = require("./socket/socket");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


socketHandler(io);


app.use("/users", require("./routes/userRoutes"));

app.use(
  "/transactions",
  require("./routes/transactionRoutes")(io)
);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});