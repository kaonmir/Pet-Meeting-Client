// {{BASEURL}}/worry

const express = require("express");
const worry = require("../api/worry");
const response = require("../services/response");
const session = require("../services/session");
const { formatTime } = require("../services/format");
const comment = require("./comment");
const router = express.Router();

/* --------------------- Bookmark ---------------------*/
router.post("/bookmark/:wid", (req, res) => {
  const wid = Number(req.params.wid);

  if (!isNaN(wid) && wid > 0) {
    const uid = session.getUID(req);
    worry
      .bookmarked(wid, uid)
      .then((result) => {
        if (result)
          worry
            .unbookmark(wid, uid)
            .then((result) => res.json(response.success({ bookmarked: false })))
            .catch((err) => res.json(response.fail("Database Error")));
        else
          worry
            .bookmark(wid, uid)
            .then((result) => res.json(response.success({ bookmarked: true })))
            .catch((err) => res.json(response.fail("Database Error")));
      })
      .catch((err) => res.json(response.fail("Database Error")));
  } else res.json(response.fail("WID is wrong"));
});

router.get("/bookmark/:wid", (req, res) => {
  const wid = Number(req.params.wid);

  if (!isNaN(wid) && wid > 0) {
    const uid = session.getUID(req);
    worry
      .bookmarked(wid, uid)
      .then((result) => {
        if (result) res.json(response.success({ bookmarked: true }));
        else res.json(response.success({ bookmarked: false }));
      })
      .catch((err) => res.json(response.fail("Database Error")));
  } else res.json(response.fail("WID is wrong"));
});

module.exports = router;
