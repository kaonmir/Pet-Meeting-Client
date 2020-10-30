// Server and app
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
var ios = require("express-socket.io-session"); // Support to access session in socket

// Services and Utilities
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");
const session = require("express-session");
const multer = require("multer");
const upload = multer();

const mysql = require("mysql");
const redis = require("redis");
const { container } = require("./src/services/Container");

// Routers
const index = require("./src/api/index");
// const socket = require("./routes/socket"); //TODO

// Options
const config = require("./config.json");

/* -------------- Predefined - Databse -------------- */
const connection = mysql.createConnection(config.MySQLOption);
connection.connect();

const client = redis.createClient(
  config.RedisOption.port,
  config.RedisOption.host
);
client.echo("Redis Connecting Successfully", (err, reply) => {
  if (err) console.log(err);
  else console.log(reply);
});
container.init(connection, client);

/* -------------- Predefined - Others -------------- */
app.use(bodyParser.urlencoded({ extended: false })); // Parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // Parsing application/json
// app.use(upload.array()); // Parsing multipart/form-data
app.use(cors()); // Allowing CORS for developing
app.use(methodOverride()); // For client doesn't support PUT and DELETE

const sess = session(config.SessionOption);
app.use(sess); // Configuring session
io.use(ios(sess, { autoSave: true })); // For Connecting session and socket.io

/* -------------- Routing & Listening -------------- */

app.all("*", multer(config.MulterOption).single("img"), (req, res, next) => {
  req.container = container;
  next();
});

app.use("/", index);
io.sockets.on("connection", container.socketService.connect);

server.listen(
  config.PORT,
  console.log(`Server listening on port ${config.PORT}`)
);
