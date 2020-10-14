// For sign in and up.
// /user
const express = require("express");
const router = express.Router();

const { login, signup } = require("../api/user");
const multer = require("../api/multer");
const MySQL = require("../api/mysql");
const chat = require("../api/chat");
const model = require("../model/model");
const response = require("../services/response");
const session = require("../services/session");

router.get("/logined", (req, res) => {
  const uid = session.getUID(req);
  if (uid) res.json(response.success({ id: uid }));
  else res.json(response.fail("Not logined"));
});

router.post("/login", (req, res) => {
  const errors = model.user.validate(req.body);
  if (errors.length != 0) res.json(response.fail(errors[0]));
  else {
    const { username, password } = req.body;
    login(username, password)
      .then((uid) => {
        if (uid) {
          req.session.uid = uid; // Set session's id
          res.json(response.success({ uid: uid }));
        } else res.status(400).json(response.fail("No User exists"));
      })
      .catch((err) => res.status(500).json(response.fail("Database Error")));
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  if (req.session == undefined) res.json(response.success());
  else res.json(response.fail("Destroy session error"));
});

router.get("/profile", (req, res) => {
  const uid = session.getUID(req);
  var getPets = MySQL.list("PetView", 100, 0, [{ name: "UID", value: uid }]);
  var getChats = chat.scan(uid).then(
    (uids) => Promise.all(uids.map((uid) => MySQL.get("UserView", "UID", uid)))
    // message를 뽑아야 한다.
  );
  Promise.all([getPets, getChats])
    .then((values) => {
      const json = {
        pets: values[0],
        chats: values[1],
      };
      res.json(response.success(json));
    })
    .catch(() => res.json(response.fail("Destroy session error")));
});

router.get("/my", (req, res) => {
  const uid = session.getUID(req);
  MySQL.get("UserView", "UID", uid).then((result) =>
    res.json(response.success(result))
  );
});

// 유저 정보 지우기

module.exports = router;
