// {{BASEURL}}/worry/comment

const express = require("express");
const response = require("../services/response");
const comment = require("../api/comment");
const router = express.Router();

router.get("/list/:wid", (req, res) => {
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;

  // WID를 가지고 오는 게 맞다!
  const wid = Number(req.params.wid);

  if (!isNaN(wid) && wid > 0) {
    if (limit < 0 || offset < 0)
      res.status(400).json(response.fail("Parameter Error"));
    else
      comment
        .list(wid, limit, offset)
        .then((result) => res.json(response.success(result)))
        .catch((err) => res.json(response.fail("Database Error")));
  } else res.json(response.fail("WID is wrong"));
});

module.exports = router;
