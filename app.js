const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const methodOverride = require("method-override");
const cors = require("cors");
const session = require("./services/session");
const mysql = require("./api/mysql");

const user = require("./routes/user");
const profile = require("./routes/profile");
const worry = require("./routes/worry");
const showoff = require("./routes/showoff");
const sample = require("./routes/sample");

const { PORT, MySQLOption } = require("./config.json");
const response = require("./response");

/* -------------- Predefined -------------- */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mysql.createConnection(MySQLOption); // Connection to MySQL
app.use(session.SessionOption); // Configuring session
app.use(cors()); // Allowing CORS for developing
app.use(methodOverride()); // For client doesn't support PUT and DELETE

/* --------------- Routing --------------- */

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

// -------------- Listening -------------- */

app.listen(PORT, console.log(`Server listening on port ${PORT}`));
