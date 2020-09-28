// For sign in and up.
// /user
const express = require("express");
const router = express.Router();

const { login, signup } = require("../api/mysql");
const Schema = require("../model/user");
const Response = require("../response");

router.post("/login", (req, res) => {
  const errors = Schema.user.validate(req.body);

  if (errors.length != 0) res.status(400).json(Response.fail(errors[0]));
  else {
    const { username, password } = req.body;
    login(username, password)
      .then((id) => res.json(Response.success({ id: id })))
      .catch((err) => res.status(400).json(Response.fail(err)));
  }
});

router.post("/signup", (req, res) => {
  const errors = Schema.user.validate(req.body);

  if (errors.length != 0) res.status(400).json(Response.fail(errors[0]));
  else {
    const { username } = req.body.username;
    signup(req.body)
      .then((id) => res.json(Response.success({ username: username, id: id })))
      .catch((err) => res.status(400).json(Response.fail(err)));
  }
});

module.exports = router;
