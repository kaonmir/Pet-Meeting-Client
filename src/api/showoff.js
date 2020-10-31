const express = require("express");
const router = express.Router();
const multer = require("multer");

const { body, param, query, validationResult } = require("express-validator");
const { formatTime } = require("../services/format");

// GET /showoff (list)
router.get(
  "/",
  [
    query("limit").isNumeric().notEmpty(),
    query("offset").isNumeric().notEmpty(),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const { offset, limit } = req.query;
    const { error, result } = await req.container.showoffService.list(
      offset,
      limit
    );
    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// GET /showoff/:sid
router.get(
  "/:sid(\\d+)",
  [param("sid").isNumeric()],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const sid = req.params.sid;
    const { error, result } = await req.container.showoffService.get(sid);
    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// GET /showoff/best
router.get("/best", async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));
  const { error, result } = await req.container.showoffService.best();
  if (error) next(new Error(error));
  else res.json({ result });
});

// POST /showoff
router.post(
  "/",
  [body("text").isString().notEmpty()],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty() || !req.file) {
      if (req.file) req.container.imageService.removeFile(req.file.filename);
      return next(new Error("Parameter Error"));
    }
    const text = req.body.text;
    //  const uid = req.session;
    const uid = 1;
    const date = formatTime(new Date());
    const file = req.file;

    const { error, result } = await req.container.showoffService.post({
      text,
      uid,
      date,
      file,
    });
    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// PUT /showoff/:sid
router.put(
  "/:sid",
  [param("sid").isNumeric(), body("text").isString()],
  async (req, res, next) => {
    // 사진 없이도 수정 가능
    if (!validationResult(req).isEmpty()) {
      if (req.file) req.container.imageService.removeFile(req.file.filename);
      return next(new Error("Parameter Error"));
    }

    const uid = req.uid;
    const sid = req.params.sid;
    const text = req.body.text;
    const date = formatTime(new Date());
    const file = req.file;

    const {
      error: e,
      result: showoff,
    } = await req.container.showoffService.get(sid);
    if (e) next(new Error(e));
    else if (showoff.UID != uid) next(new Error("Authentication Error"));
    else {
      const { error, result } = await req.container.showoffService.update(sid, {
        text,
        date,
        file,
      });
      if (error) next(new Error(error));
      else res.json({ result });
    }
  }
);

// DELETE /showoff/:sid
router.delete("/:sid", [param("sid").isNumeric()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  //  const uid = req.session;
  const uid = 1;
  const sid = req.params.sid;

  const { error: e1, result: showoff } = await req.container.showoffService.get(
    sid
  );
  if (e1) next(new Error("Already Deleted!"));
  else if (showoff.UID != uid) next(new Error("Authentication Error"));
  else {
    const { error, result } = await req.container.showoffService.delete(sid);
    if (error) next(new Error(error));
    else res.json({ result });
  }
});

// ---------------- Vote ------------------------ //

// GET /showoff/voted/:sid
router.get(
  "/voted/:sid",
  [param("sid").isNumeric()],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const uid = req.uid;
    const sid = req.params.sid;
    const { error, result } = await req.container.showoffService.isvoted(
      uid,
      sid
    );

    if (error) return next(new Error(error));
    else res.json({ result });
  }
);

// GET /showoff/vote/:sid
router.get("/vote/:sid", [param("sid").isNumeric()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  const uid = req.uid;
  const sid = req.params.sid;
  const { error, result } = await req.container.showoffService.vote(uid, sid);

  if (error) return next(new Error(error));
  else res.json({ result });
});

module.exports = router;
