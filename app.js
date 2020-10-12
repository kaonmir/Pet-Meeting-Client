// Server and app
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Services and Utilities
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");
const session = require("express-session");
const MySQL = require("./api/mysql");
const Redis = require("./api/redis");
const multer = require("multer");

// Routers
const index = require("./routes/index");
const socket = require("./routes/socket");

// Options
const config = require("./config.json");

/* -------------- Predefined -------------- */

MySQL.createConnection(config.MySQLOption); // MySQL
Redis.createClient(config.RedisOption.port, config.RedisOption.host); // Redis

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session(config.SessionOption)); // Configuring session
app.use(cors()); // Allowing CORS for developing
app.use(methodOverride()); // For client doesn't support PUT and DELETE

/* --------------- Routing --------------- */

// app.use("/", express.static(__dirname + "/build")); // For Frontend
// app.use("/image", express.static(__dirname + "/images")); // For image

app.use("/", index);
io.on("connection", socket); // Socket.io for chatting

/* -------------- Listening -------------- */

server.listen(
  config.PORT,
  console.log(`Server listening on port ${config.PORT}`)
);
