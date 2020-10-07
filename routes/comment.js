// {{BASEURL}}/worry/comment

const express = require("express");
const worry = require("../api/worry");
const response = require("../services/response");
const session = require("../services/session");
const { formatTime } = require("../services/format");
const comment = require("../api/comment");
const router = express.Router();

router.get("/list/:wid", (req, res) => {
  const limit = req.query.limit;
  const offset = req.query.offset | 0;

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

router.get("/:cid", (req, res) => {
  const cid = Number(req.params.cid);

  if (!isNaN(cid) && cid > 0)
    comment
      .get(cid)
      .then((result) => res.json(response.success(result)))
      .catch((err) => res.json(response.fail("Database Error")));
  else res.json(response.fail("CID is wrong"));
});

router.post("/", (req, res) => {
  const text = req.body.text;
  const wid = Number(req.body.wid);
  const uid = session.getUID(req);
  const date = formatTime(new Date());

  if (text == undefined || isNan(wid) || wid < 0)
    res.json(response.fail("Fill the blank completely"));
  else
    comment
      .comment(text, date, wid, uid)
      .then((result) => res.json(response.success({ CID: result.insertId })))
      .catch((err) => res.json(response.fail("Database Error")));
});
router.post("/re", (req, res) => {
  const text = req.body.text;
  const cid = Number(req.body.cid);
  const uid = session.getUID(req);
  const date = formatTime(new Date());

  if (text == undefined || isNaN(cid) || cid < 0)
    res.json(response.fail("Fill the blank completely"));
  else
    comment
      .get(cid)
      .then((result) => {
        if (result)
          comment
            .recomment(text, date, cid, result.WID, uid)
            .then((result) =>
              res.json(response.success({ CID: result.insertId }))
            )
            .catch((err) => res.json(response.fail("Database Error")));
        else res.json(response.fail("There's no comment"));
      })
      .catch((err) => res.json(response.fail("Database Error")));
});

router.put("/:cid", (req, res) => {
  const cid = Number(req.params.cid);
  const text = req.body.text;
  const uid = session.getUID(req);

  if (text == undefined) res.json(response.fail("Fill the blank completely"));
  else if (isNaN(cid) || cid < 0) res.json(response.fail("WID is wrong"));
  else
    comment
      .get(cid)
      .then((result) => {
        if (result.UID != uid) res.json(response.fail("Authorizaion Error"));
        else
          comment
            .update(cid, text)
            .then((result) => res.json(response.success()))
            .catch((err) => res.json(response.fail("Database Error")));
      })
      .catch((err) => res.json(response.fail("Database Error")));
});

router.delete("/:cid", (req, res) => {
  const cid = Number(req.params.cid);

  // Check whether cid is valid or not
  if (!isNaN(cid) && cid > 0) {
    const uid = session.getUID(req);

    comment
      .get(cid)
      .then((result) => {
        // Check whether uid is valid or not
        if (result.UID != uid) res.json(response.fail("Authorizaion Error"));
        else
          comment
            .delete(cid)
            .then(() => res.json(response.success()))
            .catch((err) => res.json(response.fail("Database Error")));
      })
      .catch((err) => res.json(response.fail("Database Error")));
  } else res.json(response.fail("CID is wrong"));
});
module.exports = router;
