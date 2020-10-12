// For sign in and up.
// /user
const express = require("express");
const router = express.Router();

const { login, signup } = require("../api/user");
const multer = require("../api/multer");
const model = require("../model/model");
const MySQL = require("../api/mysql");
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
        req.session.uid = uid; // Set session's id
        res.json(response.success({ uid: uid }));
      })
      .catch((err) => res.status(400).json(response.fail("Database Error")));
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  if (req.session == undefined) res.json(response.success());
  else res.json(response.fail("Destroy session error"));
});

// 유저 정보 지우기

module.exports = router;
