// For sign in and up.
// /profile
const express = require("express");
const router = express.Router();

const { profile } = require("../api/profile");
const Response = require("../response");
const session = require("../services/session");

router.get("/", (req, res) => {
  const id = session.getUID(req);

  profile(id)
    .then((result) => res.json(Response.success(result)))
    .catch((err) => res.json(Response.fail("Database Error")));
});

module.exports = router;
