const express = require("express");
const router = express.Router();
const multer = require("multer");

const { body, query, param, validationResult } = require("express-validator");

// GET /download/:filename
router.get(
  "/download",
  [
    query("filename").isString().optional({ checkFalsy: true }),
    query("imgid").isString().optional({ checkFalsy: true }),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const { filename, imgid } = req.query;
    if (!filename && !imgid) return next(new Error("Parameter Error"));

    const { error, result } = filename
      ? await req.container.imageService.downloadWithFilename(
          filename,
          "sample.jpg"
        )
      : await req.container.imageService.downloadWithId(imgid);

    if (error) next(new Error(error));
    else {
      res.setHeader("Content-Type", "binary/octet-stream");
      res.setHeader(
        "Content-Disposition",
        'attachment;filename="' + encodeURI(result.originalName) + '"'
      );
      result.fileStream.pipe(res);
    }
  }
);

module.exports = router;
