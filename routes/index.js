const express = require("express");
const router = express.Router();
const MySQL = require("../api/mysql");

const user = require("./user");
const sample = require("./sample");
const chat = require("./chat");
const entrust = require("./entrust");
const comment = require("./comment");

const sess = require("../services/session");
const response = require("../services/response");
const model = require("../model/model");
const { formatTime } = require("../services/format");
const multer = require("../api/multer");

function prom(res, promise) {
  if (promise)
    promise
      .then((result) => res.json(response.success(result)))
      .catch((err) => {
        if (err) res.status(400).json(response.fail(err));
        else res.status(500).json(response.fail("Database Error"));
      });
}

function cap(json) {
  var answer = {};
  Object.keys(json).forEach((name) => {
    var temp = name[0].toUpperCase() + name.slice(1);
    answer[temp] = json[name];
  });
  return answer;
}

/* --------------- Routing --------------- */

router.use("/user", user);
router.use("/sample", sample); // For Test

// Check if logined
router.all("*", (req, res, next) => {
  req.body = cap(req.body);
  const id = sess.getUID(req);
  if (id) next();
  else res.json(response.fail("Login please"));
});

router.all("/:table*", (req, _res, next) => {
  var { table } = req.params;
  req.table = table.charAt(0).toUpperCase() + table.slice(1);
  req.id_name = table[0] + "ID";
  next();
});

// For exceptional routing
router.use("/user", user);
router.use("/chat", chat);
router.use("/comment", comment);

// LIST
router.get("/:table/list", (req, res) => {
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;

  prom(res, MySQL.list(req.table + "View", limit, offset));
});

// Auth for PUT and DELETE
router.all("/:table/:id", (req, res, next) => {
  const type = req.method;
  const { id } = req.params;
  const uid = sess.getUID(req);

  if (type == "PUT" || type == "DELETE") {
    MySQL.get(req.table, req.id_name, id).then((result) => {
      if (result.UID == uid) next();
      else res.json(response.fail("Authorization Error!"));
    });
  } else next();
});

// GET, UPDATE(PUT), DELETE
router.all("/:table/:id", multer.single("img"), (req, res, next) => {
  const type = req.method;
  const { table, id_name } = req;
  const { id } = req.params;
  const file = req.file;

  req.body = cap(req.body);

  if (type == "GET") prom(res, MySQL.get(table, id_name, id));
  else if (type == "PUT") {
    if (!file) prom(res, MySQL.update(table, req.body, id_name, id));
    else {
      multer.upload(file).then((ImgID) => {
        req.body.ImgID = ImgID;
        prom(res, MySQL.update(table, req.body, id_name, id));
      });
    }
  } else if (type == "DELETE") prom(res, MySQL.delete(table, id_name, id));
  else next();
});

//POST
router.post("/:table", multer.single("img"), (req, res, next) => {
  const file = req.file;
  const errors = model[req.params.table].validate(req.body);

  req.body = cap(req.body);

  if (errors.length != 0) res.status(400).json(response.fail(errors[0]));
  else {
    // User, Showoff, Pet은 제외
    if (req.table != "Pet" && req.table != "User")
      req.body.Date = formatTime(new Date());
    if (!file) prom(res, MySQL.write(req.table, req.body));
    else {
      multer
        .upload(file)
        .then((ImgID) => {
          req.body.ImgID = ImgID;
          prom(res, MySQL.write(req.table, req.body));
        })
        .catch((err) => res.status(404).json(response.fail("Database Error")));
    }
  }
});

module.exports = router;
