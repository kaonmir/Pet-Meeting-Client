// Server and app
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Services and Utilities
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");
const session = require("./services/session");
const MySQL = require("./api/mysql");
const Redis = require("./api/redis");

// Routers
const user = require("./routes/user");
const profile = require("./routes/profile");
const worry = require("./routes/worry");
const showoff = require("./routes/showoff");
const sample = require("./routes/sample");
const chat = require("./routes/chat");
const socket = require("./routes/socket");
const pet = require("./routes/pet");

// Options
const config = require("./config.json");
const response = require("./services/response");

/* -------------- Predefined -------------- */

MySQL.createConnection(config.MySQLOption); // MySQL
Redis.createClient(config.RedisOption.port, config.RedisOption.host); // Redis

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session.SessionOption); // Configuring session
app.use(cors()); // Allowing CORS for developing
app.use(methodOverride()); // For client doesn't support PUT and DELETE

/* -------------- Function -------------- */

var checkLogined = (req, res, next) => {
  const id = session.getUID(req);
  if (id == undefined || id < 0) res.json(response.fail("Login please"));
  else next();
};

/* --------------- Routing --------------- */

app.use("/", express.static(__dirname + "/build")); // For Frontend
// app.use("/image", express.static(__dirname + "/images")); // For image
app.use("/user", user);
app.use("/sample", sample); // For Test

app.all("*", checkLogined); // Check if logined

app.use("/profile", profile);
app.use("/worry", worry);
app.use("/showoff", showoff);
app.use("/chat", chat);
app.use("/pet", pet);

io.on("connection", socket); // Socket.io for chatting

/* -------------- Listening -------------- */

server.listen(
  config.PORT,
  console.log(`Server listening on port ${config.PORT}`)
);
