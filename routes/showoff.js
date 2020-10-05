const express = require("express");
const showoff = require("../api/showoff");
const response = require("../response");
const session = require("../services/session");
const { formatTime } = require("../services/format");
const router = express.Router();

router.get("/", (req, res) => {
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;

  showoff
    .list(limit, offset)
    .then((result) => res.json(response.success(result)))
    .catch((err) => res.json(response.fail("Database Error")));
});

router.get("/best", (req, res) => {
  showoff
    .best()
    .then((result) => res.json(response.success(result)))
    .catch((err) => res.json(response.fail("Database Error")));
});

module.exports = router;
