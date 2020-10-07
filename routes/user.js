// For sign in and up.
// /user
const express = require("express");
const router = express.Router();

const { login, signup } = require("../api/user");
const Schema = require("../model/user");
const Response = require("../response");
const session = require("../services/session");

router.get("/logined", (req, res) => {
  const uid = session.getUID(req);
  if (uid) res.json(Response.success({ id: uid }));
  else res.json(Response.fail("Not logined"));
});

router.post("/login", (req, res) => {
  const errors = Schema.user.validate(req.body);

  if (errors.length != 0) res.status(400).json(Response.fail(errors[0]));
  else {
    const { username, password } = req.body;
    login(username, password)
      .then((uid) => {
        req.session.uid = uid; // Set session's id
        res.json(Response.success({ uid: uid }));
      })
      .catch((err) => res.status(400).json(Response.fail(err)));
  }
});

router.post("/signup", (req, res) => {
  const errors = Schema.user.validate(req.body);
  if (errors.length != 0) res.status(400).json(Response.fail(errors[0]));
  else {
    const { username } = req.body.username;
    signup(req.body)
      .then((uid) =>
        res.json(Response.success({ username: username, uid: uid }))
      )
      .catch((err) => res.status(400).json(Response.fail(err)));
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(400).json(Response.fail(err));
    else res.json(Response.success());
  });
});

module.exports = router;
