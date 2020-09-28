// For sign in and up.
// /user
const express = require("express");
const router = express.Router();

const { login, signup } = require("../api/mysql");
const Schema = require("../model/user");
const Response = require("../response");

router.get("/id", (req, res) => {
  const { uid } = req.session;
  if (uid) res.json(Response.success({ id: uid }));
  else res.status(400).json(Response.fail("Not logined"));
});

router.get("/logined", (req, res) => {
  const { uid } = req.session;
  if (uid) res.json(Response.success({ id: uid }));
  else res.status(400).json(Response.fail("Not logined"));
});

router.post("/login", (req, res) => {
  console.log(req.body);
  const errors = Schema.user.validate(req.body);

  if (errors.length != 0) res.status(400).json(Response.fail(errors[0]));
  else {
    const { username, password } = req.body;
    login(username, password)
      .then((id) => {
        req.session.uid = id; // Set session's id
        res.json(Response.success({ id: id }));
      })
      .catch((err) => res.status(400).json(Response.fail(err)));
  }
});

router.post("/signup", (req, res) => {
  console.log(req.body);

  const errors = Schema.user.validate(req.body);
  if (errors.length != 0) res.status(400).json(Response.fail(errors[0]));
  else {
    const { username } = req.body.username;
    signup(req.body)
      .then((id) => res.json(Response.success({ username: username, id: id })))
      .catch((err) => res.status(400).json(Response.fail(err)));
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(400).json(Response.fail(err));
    else res.json(Response.success({}));
  });
});

module.exports = router;
