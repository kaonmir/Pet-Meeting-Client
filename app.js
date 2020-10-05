const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const methodOverride = require("method-override");
const cors = require("cors");
const session = require("express-session");
const mysql = require("./api/mysql");

const user = require("./routes/user");
const profile = require("./routes/profile");
const worry = require("./routes/worry");
const showoff = require("./routes/showoff");
const sample = require("./routes/sample");

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
app.use(methodOverride()); // For client doesn't support PUT and DELETE

/* --------------- Routing --------------- */

app.use("/user", user);
app.use("/profile", profile);
app.use("/worry", worry);
app.use("/showoff", showoff);

app.use("/sample", sample); // For Test

// -------------- Listening -------------- */

app.listen(PORT, console.log(`Server listening on port ${PORT}`));
