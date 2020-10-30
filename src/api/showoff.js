const express = require("express");
const router = express.Router();
const multer = require("multer");

const { body, param, validationResult } = require("express-validator");
const { formatTime } = require("../services/format");

// GET /showoff/:sid
router.get("/:sid", [param("sid").isString()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  const sid = req.param.sid;
  const { error, result } = await req.container.showoffService.get(sid);
  if (error) next(new Error(error));
  else res.json({ result });
});

// POST /showoff
router.post("/", [body("text").isString()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  const text = req.body;
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
});

// PUT /showoff/:sid
router.put(
  "/:sid",
  [param("sid").isNumeric(), body("text").isString()],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const uid = req.uid;
    const text = req.body;
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
  const sid = req.param.sid;

  const { error: e1, result: showoff } = await req.container.showoffService.get(
    sid
  );
  if (e1) next(new Error(e1));
  else if (showoff.UID != uid) next(new Error("Authentication Error"));
  else {
    const { error, result } = req.container.showoffService.delete(sid);
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
