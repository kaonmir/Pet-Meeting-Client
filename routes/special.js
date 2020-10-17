const express = require("express");
const router = express.Router();
const response = require("../services/response");
const session = require("../services/session");

const comment = require("../api/comment");
const bookmark = require("../api/bookmark");
const multer = require("../api/multer");
const vote = require("../api/vote");

const { formatTime } = require("../services/format");
const MySQL = require("../api/mysql");

/* -------------- Function -------------- */
function posInt(num) {
  num = Number(num);
  if (!isNaN(num) && num > 0) return num;
  else return 0;
}

function prom(res, promise) {
  promise
    .then((result) => res.json(response.success(result)))
    .catch((err) => res.json(response.fail(err)));
}
/* --------------- Info --------------- */

router.get("/info/list", (req, res) => {
  Promise.all([
    MySQL.list("Housing", 100, 0),
    MySQL.list("Species", 100, 0),
    MySQL.list("Breed", 100, 0, [{ name: "SpeciesID", value: 1 }]),
  ]).then((values) =>
    res.json(
      response.success({
        Housing: values[0],
        Species: values[1],
        Breed: values[2],
      })
    )
  );
});

router.get("/info/:table", (req, res) => {
  MySQL.list(req.params.table, 100, 0)
    .then((result) => res.json(response.success(result)))
    // TODO err 바로 보내면 안됌
    .catch((err) => res.json(response.fail(err)));
});

/* --------------- Comment --------------- */
router.get("/comment/list/:wid", (req, res) => {
  const limit = posInt(req.query.limit);
  const offset = posInt(req.query.offset);

  // WID를 가지고 오는 게 맞다!
  const wid = posInt(req.params.wid);

  if (wid == 0) res.json(response.fail("WID is wrong"));
  else if (limit == 0 || offset == 0)
    res.status(400).json(response.fail("Parameter Error"));
  else prom(res, comment.list(wid, limit, offset));
});

/* --------------- Bookmark --------------- */
router.post("/bookmark/:wid", (req, res) => {
  const wid = posInt(req.params.wid);

  if (wid == 0) res.json(response.fail("WID is wrong"));
  else {
    const uid = session.getUID(req);
    bookmark
      .bookmarked(wid, uid)
      .then((result) => {
        if (result) prom(res, bookmark.unbookmark(wid, uid));
        else prom(res, bookmark.bookmark(wid, uid));
      })
      .catch((err) => res.json(response.fail("Database Error")));
  }
});

router.get("/bookmark/:wid", (req, res) => {
  const wid = posInt(req.params.wid);

  if (wid == 0) res.json(response.fail("WID is wrong"));
  else {
    const uid = session.getUID(req);
    bookmark
      .bookmarked(wid, uid)
      .then((result) => {
        if (result) res.json(response.success({ bookmarked: true }));
        else res.json(response.success({ bookmarked: false }));
      })
      .catch((err) => res.json(response.fail("Database Error")));
  }
});

/* ------------ Showoff-Best ------------ */
router.get("/showoff/best", (req, res) => {
  vote
    .best()
    .then((result) => res.json(response.success(result)))
    .catch((err) => res.json(response.fail(err)));
});

/* ----------- Download Image ----------- */
router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const originalname = req.params.originalname || "sample.jpg";

  // filename이 이상하면 refuse해야함
  if (filename == undefined) res.status(400).json("Error!!");
  else {
    try {
      const fileStream = multer.download(filename);
      res.setHeader("Content-Type", "binary/octet-stream");
      res.setHeader(
        "Content-Disposition",
        "attachment;filename=" + encodeURI(originalname)
      );
      fileStream.pipe(res);
    } catch (error) {
      console.log(error);
      res.status(400).json("Error!!");
    }
  }
});

/* ----------- Upload Image ----------- */
router.post("/upload", multer.single("img"), (req, res) => {
  const file = req.file;

  if (file == undefined) res.status(404).json("Error!!");
  else {
    multer
      .upload(file)
      .then((ImageID) => res.json(response.success(file)))
      .catch((err) => res.status(400).json("Error!!"));
  }
});

module.exports = router;
