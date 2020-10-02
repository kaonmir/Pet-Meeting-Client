// For sign in and up.
// /profile
const express = require("express");
const router = express.Router();

const { profile, profile_user } = require("../api/profile");
const Response = require("../response");

router.get("/", (req, res) => {
  const id = "1";
  // const id = req.session.uid;

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
