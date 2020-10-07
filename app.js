// Server and app
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Services and Utilities
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

// Options
const { PORT, MySQLOption, RedisOption } = require("./config.json");
const response = require("./response");

/* -------------- Predefined -------------- */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

MySQL.createConnection(MySQLOption); // MySQL
Redis.createClient(RedisOption.port, RedisOption.host); // Redis
app.use(session.SessionOption); // Configuring session
app.use(cors()); // Allowing CORS for developing
app.use(methodOverride()); // For client doesn't support PUT and DELETE

/* --------------- Routing --------------- */

io.on("connection", socket); // Socket.io for chatting

app.use("/user", user);
app.use("/sample", sample); // For Test

// Check if logined
app.all("*", (req, res, next) => {
  const id = session.getUID(req);
  if (id == undefined || id < 0) res.json(response.fail("Login please"));
  else next();
});

app.use("/profile", profile);
app.use("/worry", worry);
app.use("/showoff", showoff);
app.use("/chat", chat);

// -------------- Listening -------------- */

server.listen(PORT, console.log(`Server listening on port ${PORT}`));
