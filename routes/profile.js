// For sign in and up.
// /profile
const express = require("express");
const router = express.Router();

const { profile, profile_user } = require("../api/profile");
const Response = require("../response");
const session = require("../services/session");

router.get("/", (req, res) => {
  const id = session.getUID(req);

  if (id == undefined) res.json(Response.fail("Login first!!"));
  else {
    profile(id)
      .then((result) => {
        console.log(result);
        res.json(Response.success(result));
      })
      .catch((err) => console.log(err));
  }
});

module.exports = router;
