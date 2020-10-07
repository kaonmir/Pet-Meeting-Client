// For sign in and up.
// /user
const express = require("express");
const router = express.Router();

const { login, signup } = require("../api/user");
const Schema = require("../model/user");
const response = require("../services/response");
const session = require("../services/session");

router.get("/logined", (req, res) => {
  const uid = session.getUID(req);
  if (uid) res.json(response.success({ id: uid }));
  else res.json(response.fail("Not logined"));
});

router.post("/login", (req, res) => {
  const errors = Schema.user.validate(req.body);

  if (errors.length != 0) res.status(400).json(response.fail(errors[0]));
  else {
    const { username, password } = req.body;
    login(username, password)
      .then((uid) => {
        req.session.uid = uid; // Set session's id
        res.json(response.success({ uid: uid }));
      })
      .catch((err) => res.status(400).json(response.fail(err)));
  }
});

router.post("/signup", (req, res) => {
  const errors = Schema.user.validate(req.body);
  if (errors.length != 0) res.status(400).json(response.fail(errors[0]));
  else {
    const { username } = req.body.username;
    signup(req.body)
      .then((uid) =>
        res.json(response.success({ username: username, uid: uid }))
      )
      .catch((err) => res.status(400).json(response.fail(err)));
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(400).json(response.fail(err));
    else res.json(response.success());
  });
});

module.exports = router;
