const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mysql = require("./api/mysql");

const user = require("./routes/user");

const { PORT, MySQLOption } = require("./config.json");

/* -------------- Predefined -------------- */

app.use(bodyParser.urlencoded({ extended: false }));

// Connection to MySQL
mysql.createConnection(MySQLOption);

// Allowing CORS for developing
app.use(cors());

/* --------------- Routing --------------- */

app.use("/user", user);

// -------------- Listening -------------- */

app.listen(PORT, console.log(`Server listening on port ${PORT}`));
