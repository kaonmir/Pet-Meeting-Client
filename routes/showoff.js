const express = require("express");
const showoff = require("../api/showoff");
const response = require("../response");
const router = express.Router();

router.get("/", (req, res) => {
  const limit = req.query.limit | 5;
  const offset = req.query.offset | 0;

  showoff
    .best()
    .then((result) => res.json(response.success(result)))
    .catch((err) => {
      console.log(err);
      res.json(response.fail("Database Error"));
    });
});

module.exports = router;
