const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");

const user = require("./routes/user");

const { PORT, MySQLOption } = require("./config.json");

/* -------------- Predefined -------------- */

app.use(bodyParser.urlencoded({ extended: false }));

// Connection to MySQL
const connection = mysql.createConnection(MySQLOption);
connection.connect();

// Allowing CORS for developing
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

/* --------------- Routing --------------- */

app.use("/user", user);

// -------------- Listening -------------- */

app.listen(PORT, console.log(`Server listening on port ${PORT}`));
