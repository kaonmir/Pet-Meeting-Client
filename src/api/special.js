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

router.get("/chat/list/:uid", async (req, res) => {
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;
  const uid1 = req.uid;
  const uid2 = Number(req.params.uid); // oponent's uid

  if (uid1 == uid2) res.json(response.fail("It's same UID!!"));
  else if (isNaN(uid2) || uid2 < 0) res.json(response.fail("UID is wrong"));
  else {
    const chatID = await req.container.chatModel.getChatID(uid1, uid2);
    const { result, error } = await req.container.chatModel.list(
      chatID,
      limit,
      offset
    );

    console.log(result);

    if (error) next(Error(error));
    else res.json({ result });
  }
});
module.exports = router;
