// /profile
const express = require("express");
const router = express.Router();

const { profile } = require("../api/profile");
const multer = require("../api/multer");
const response = require("../services/response");
const session = require("../services/session");

router.get("/", (req, res) => {
  const id = session.getUID(req);

  profile(id)
    .then((result) => res.json(response.success(result)))
    .catch((err) => res.json(response.fail("Database Error")));
});

router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const originalname = req.params.originalname || "sample.jpg";

  const fileStream = multer.download(filename);
  res.setHeader("Content-Type", "binary/octet-stream");
  res.setHeader(
    "Content-Disposition",
    "attachment;filename=" + encodeURI(originalname)
  );
  fileStream.pipe(res);
});
module.exports = router;
