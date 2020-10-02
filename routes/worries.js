const express = require("express");
const { worries } = require("../api/worries");
const response = require("../response");
const router = express.Router();

router.get("/", (req, res) => {
  const limit = req.query.limit;

  if (!limit || limit < 0)
    res.status(400).json(response.fail("Parameter Error"));
  else
    worries(limit)
      .then((result) => res.json(response.success(result)))
      .catch((err) => {
        console.log(err);
        res.json(response.fail("Database Error"));
      });
});

module.exports = router;
