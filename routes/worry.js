const express = require("express");
const worry = require("../api/worry");
const response = require("../response");
const session = require("../services/session");
const { formatTime } = require("../services/format");
const router = express.Router();

router.get("/list", (req, res) => {
  const limit = req.query.limit | 5;
  const offset = req.query.offset | 0;

  if (limit < 0 || offset < 0)
    res.status(400).json(response.fail("Parameter Error"));
  else
    worry
      .list(limit, offset)
      .then((result) => res.json(response.success(result)))
      .catch((err) => res.json(response.fail("Database Error")));
});

router.get("/:wid", (req, res) => {
  const wid = Number(req.params.wid);
  if (!isNaN(wid) && wid > 0)
    worry
      .get(wid)
      .then((result) => res.json(response.success(result)))
      .catch((err) => res.json(response.fail("Database Error")));
  else res.json(response.fail("WID is wrong"));
});

router.post("/", (req, res) => {
  const { title, text } = req.body;
  const uid = session.getUID(req);
  const date = formatTime(new Date());

  if (title == undefined || text == undefined)
    res.json(response.fail("Fill the blank completely"));
  else if (uid == undefined || uid < 0) res.json(response.fail("Login Please"));
  else
    worry
      .write(title, text, date, uid)
      .then((result) => res.json(response.success({ SID: result.insertId })))
      .catch((err) => res.json(response.fail("Database Error")));
});

router.put("/:wid", (req, res) => {
  const wid = Number(req.params.wid);
  const { title, text } = req.body;
  const uid = session.getUID(req);

  if (title == undefined || text == undefined)
    res.json(response.fail("Fill the blank completely"));
  else if (uid == undefined || uid < 0) res.json(response.fail("Login Please"));
  else if (isNaN(wid) || wid <= 0) res.json(response.fail("WID is wrong"));
  else
    worry
      .get(wid)
      .then((result) => {
        if (result.UID != uid) res.json(response.fail("Authorizaion Error"));
        else
          worry
            .update(wid, title, text)
            .then((result) => res.json(response.success()))
            .catch((err) => res.json(response.fail("Database Error")));
      })
      .catch((err) => res.json(response.fail("Database Error")));
});

router.delete("/:wid", (req, res) => {
  const wid = Number(req.params.wid);

  // Check whether wid is valid or not
  if (!isNaN(wid) && wid > 0) {
    const uid = session.getUID(req);

    // Check whether uid is valid or not
    if (uid == undefined || uid < 0) res.json(response.fail("Login Please"));
    else {
      worry
        .get(wid)
        .then((result) => {
          // Check whether uid is valid or not
          if (result.UID != uid) res.json(response.fail("Authorizaion Error"));
          else
            worry
              .delete(wid)
              .then(() => res.json(response.success()))
              .catch((err) => res.json(response.fail("Database Error")));
        })
        .catch((err) => res.json(response.fail("Database Error")));
    }
  } else res.json(response.fail("WID is wrong"));
});

module.exports = router;
