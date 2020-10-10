const express = require("express");
const showoff = require("../api/showoff");
const response = require("../services/response");
const session = require("../services/session");
const { formatTime } = require("../services/format");
const multer = require("../api/multer");
const router = express.Router();

router.get("/list", (req, res) => {
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;

  showoff
    .list(limit, offset)
    .then((result) => res.json(response.success(result)))
    .catch((err) => res.json(response.fail("Database Error")));
});

// 매번 실행말고 저장해 놓고 보내는 방법 생각
router.get("/best", (req, res) => {
  showoff
    .best()
    .then((result) => res.json(response.success(result)))
    .catch((err) => res.json(response.fail("Database Error")));
});

router.get("/:sid", (req, res) => {
  const sid = Number(req.params.sid);
  if (!isNaN(sid) && sid > 0)
    showoff
      .get(sid)
      .then((result) => res.json(response.success(result)))
      .catch((err) => res.json(response.fail("Database Error")));
  else res.json(response.fail("SID is wrong"));
});

// Write showoff post
router.post("/", multer.single("img"), (req, res) => {
  const uid = session.getUID();
  const text = req.body.text;
  const date = formatTime(new Date());
  const file = req.file;

  if (file == undefined) res.json(response.fail("There's no image!!"));
  else if (text == undefined) res.json(response.fail("No Text!!"));
  else {
    multer
      .upload(file)
      .then((imgID) =>
        showoff
          .write(imgID, text, date, uid)
          .then((result) =>
            res.json(response.success({ SID: result.insertId }))
          )
          .catch((_err) => res.json(response.fail("Database Error")))
      )
      .catch((_err) => res.json(response.fail("Database Error")));
  }
});

// toDO: Can improve performace to not upload image every time.
router.put("/:sid", multer.single("img"), (req, res) => {
  const sid = Number(req.params.sid);
  const text = req.body.text;
  const file = req.file;

  if (text == undefined && file == undefined)
    res.json(response.fail("Fill in the blank completely!!"));
  else if (isNaN(sid) || sid <= 0) res.json(response.fail("SID is wrong"));
  else {
    showoff.get(sid).then((result) => {
      if (result.UID != uid) res.json(response.fail("Authorizaion Error"));
      else
        multer
          .upload(file)
          .then((imgID) => {
            showoff
              .update(sid, imgID, text)
              .then((result) => res.json(response.success()))
              .catch((_err) => res.json(response.fail("Database Error")));
          })
          .catch((_err) => res.json(response.fail("Database Error")));
    });
  }
});

router.delete("/:sid", (req, res) => {
  const sid = Number(req.params.sid);

  // Check whether sid is valid or not
  if (!isNaN(sid) && sid > 0) {
    const uid = session.getUID(req);

    showoff
      .get(sid)
      .then((result) => {
        // Check whether uid is valid or not
        if (result.UID != uid) res.json(response.fail("Authorizaion Error"));
        else
          showoff
            .delete(sid)
            .then(() => res.json(response.success()))
            .catch((err) => res.json(response.fail("Database Error")));
      })
      .catch((err) => res.json(response.fail("Database Error")));
  } else res.json(response.fail("SID is wrong"));
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
