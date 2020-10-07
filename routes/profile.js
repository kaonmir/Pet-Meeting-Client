// For sign in and up.
// /profile
const express = require("express");
const router = express.Router();

const { profile } = require("../api/profile");
const response = require("../services/response");
const session = require("../services/session");

router.get("/", (req, res) => {
  const id = session.getUID(req);

  profile(id)
    .then((result) => res.json(response.success(result)))
    .catch((err) => res.json(response.fail("Database Error")));
});

module.exports = router;
