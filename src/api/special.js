const express = require("express");
const router = express.Router();
const multer = require("multer");

const { body, param, validationResult } = require("express-validator");

// GET /download/:imgId
router.get(
  "/download/:imgId",
  [param("imgId").isNumeric()],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const imgId = req.params.imgId;
    const { error, result } = await req.container.imageService.download(imgId);

    if (error) next(new Error(error));
    else {
      res.setHeader("Content-Type", "binary/octet-stream");
      res.setHeader(
        "Content-Disposition",
        "attachment;filename=" + encodeURI(result.originalName)
      );
      result.fileStream.pipe(res);
    }
  }
);

module.exports = router;
