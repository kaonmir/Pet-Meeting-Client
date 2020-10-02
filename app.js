const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const session = require("express-session");
const mysql = require("./api/mysql");

const user = require("./routes/user");
const profile = require("./routes/profile");
const worry = require("./routes/worry");
const showoff = require("./routes/showoff");

const { PORT, MySQLOption } = require("./config.json");

/* -------------- Predefined -------------- */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuring session
app.use(
  session({
    secret: "WhateverIwant",
    resave: false,
    saveUninitialized: true,
  })
);

mysql.createConnection(MySQLOption); // Connection to MySQL
app.use(cors()); // Allowing CORS for developing

/* --------------- Routing --------------- */

app.use("/user", user);
app.use("/profile", profile);
app.use("/worry", worry);
app.use("/showoff", showoff);

// -------------- Listening -------------- */

app.listen(PORT, console.log(`Server listening on port ${PORT}`));
