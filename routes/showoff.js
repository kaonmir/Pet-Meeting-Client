const express = require("express");
const showoff = require("../api/showoff");
const response = require("../services/response");
const session = require("../services/session");
const { formatTime } = require("../services/format");
const multer = require("../api/multer");
const router = express.Router();

// 매번 실행말고 저장해 놓고 보내는 방법 생각
router.get("/best", (req, res) => {
  showoff
    .best()
    .then((result) => res.json(response.success(result)))
    .catch((err) => res.json(response.fail("Database Error")));
});

/* --------------------- Vote ---------------------*/
router.post("/vote/:sid", (req, res) => {
  const sid = Number(req.params.sid);

  if (!isNaN(sid) && sid > 0) {
    const uid = session.getUID(req);
    showoff
      .voted(sid, uid)
      .then((result) => {
        if (result)
          showoff
            .unvote(sid, uid)
            .then((result) => res.json(response.success({ voted: false })))
            .catch((err) => res.json(response.fail("Database Error")));
        else
          showoff
            .vote(sid, uid)
            .then((result) => res.json(response.success({ voted: true })))
            .catch((err) => res.json(response.fail("Database Error")));
      })
      .catch((err) => res.json(response.fail("Database Error")));
  } else res.json(response.fail("SID is wrong"));
});

router.get("/vote/:sid", (req, res) => {
  const sid = Number(req.params.sid);

  if (!isNaN(sid) && sid > 0) {
    const uid = session.getUID(req);
    showoff
      .voted(sid, uid)
      .then((result) => {
        if (result) res.json(response.success({ voted: true }));
        else res.json(response.success({ voted: false }));
      })
      .catch((err) => res.json(response.fail("Database Error")));
  } else res.json(response.fail("SID is wrong"));
});

module.exports = router;
