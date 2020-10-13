const express = require("express");
const response = require("../services/response");
const session = require("../services/session");
const { formatTime } = require("../services/format");
const multer = require("../api/multer");
const vote = require("../api/vote");
const router = express.Router();

// 매번 실행말고 저장해 놓고 보내는 방법 생각

/* --------------------- Vote ---------------------*/
router.post("/vote/:sid", (req, res) => {
  const sid = Number(req.params.sid);

  if (!isNaN(sid) && sid > 0) {
    const uid = session.getUID(req);
    vote
      .voted(sid, uid)
      .then((result) => {
        if (result)
          vote
            .unvote(sid, uid)
            .then((result) => res.json(response.success({ voted: false })))
            .catch((err) => res.json(response.fail(err)));
        else
          vote
            .vote(sid, uid)
            .then((result) => res.json(response.success({ voted: true })))
            .catch((err) => res.json(response.fail(err)));
      })
      .catch((err) => res.json(response.fail(err)));
  } else res.json(response.fail("SID is wrong"));
});

router.get("/vote/:sid", (req, res) => {
  const sid = Number(req.params.sid);

  if (!isNaN(sid) && sid > 0) {
    const uid = session.getUID(req);
    vote
      .voted(sid, uid)
      .then((result) => {
        if (result) res.json(response.success({ voted: true }));
        else res.json(response.success({ voted: false }));
      })
      .catch((err) => res.json(response.fail("Database Error")));
  } else res.json(response.fail("SID is wrong"));
});

module.exports = router;
