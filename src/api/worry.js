const express = require("express");
const router = express.Router();
const multer = require("multer");

const { body, param, validationResult } = require("express-validator");
const { formatTime } = require("../services/format");

// GET /worry/:wid
router.get("/:wid", [param("wid").isString()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  const wid = req.param.wid;
  const { error, result } = await req.container.worryService.get(wid);
  if (error) next(new Error(error));
  else res.json({ result });
});

// POST /worry
router.post(
  "/",
  [body("title").isString().notEmpty(), body("text").isString().notEmpty()],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    //  const uid = req.session;
    const uid = 1;
    const date = formatTime(new Date());
    const { title, text } = req.body;

    const { error, result } = await req.container.worryService.create({
      title,
      text,
      uid,
      date,
    });
    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// PUT /worry/:wid
router.put(
  "/:wid",
  [
    param("wid").isNumeric().notEmpty(),
    body("title").isString().notEmpty(),
    body("text").isString().notEmpty(),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const uid = req.uid;
    const { text } = req.body;
    const date = formatTime(new Date());

    const { error, result: worry } = await req.container.worryService.get(wid);
    if (error) next(new Error(error));
    else if (worry.UID != uid) next(new Error("Authentication Error"));
    else {
      const { error, result } = await req.container.worryService.update(wid, {
        title,
        text,
        date,
      });
      if (error) next(new Error(error));
      else res.json({ result });
    }
  }
);

// DELETE /worry/:wid
router.delete("/:wid", [param("wid").isNumeric()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  //  const uid = req.session;
  const uid = 1;
  const wid = req.param.wid;

  const { error, result: worry } = await req.container.worryService.get(wid);
  if (error) next(new Error(error));
  else if (worry.UID != uid) next(new Error("Authentication Error"));
  else {
    const { error, result } = req.container.worryService.delete(wid);
    if (error) next(new Error(error));
    else res.json({ result });
  }
});

/* ------------------- Comments --------------------- */

// GET /worry/comments/:wid (List)
router.get("/:wid", [param("wid").isString()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  const wid = req.param.wid;
  const { error, result } = await req.container.worryService.listComment(
    wid,
    offset,
    limit
  );
  if (error) next(new Error(error));
  else res.json({ result });
});

// GET /worry/comment/:cid
router.get("/:cid", [param("cid").isString()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  const cid = req.param.cid;
  const { error, result } = await req.container.worryService.getComment(cid);
  if (error) next(new Error(error));
  else res.json({ result });
});

// POST /worry/comment
router.post(
  "/comment",
  [body("text").isString().notEmpty(), body("wid").isNumeric().notEmpty()],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const { text, wid } = req.body;
    const uid = req.uid;
    const date = formatTime(new Date());

    const { error, result } = await req.container.worryService.createComment({
      text,
      uid,
      wid,
      date,
    });
    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// PUT /worry/comment/:cid
router.put(
  "/:cid",
  [param("cid").isNumeric().notEmpty(), body("text").isString().notEmpty()],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const uid = req.uid;
    const { cid } = req.params;
    const { text } = req.body;
    const date = formatTime(new Date());

    const {
      error: e1,
      result: comment,
    } = await req.container.worryService.getComment(cid);

    if (e1) next(new Error(e1));
    else if (comment.UID != uid) next(new Error("Authentication Error"));
    else {
      const { error, result } = await req.container.worryService.updateComment(
        cid,
        {
          text,
          date,
        }
      );
      if (error) next(new Error(error));
      else res.json({ result });
    }
  }
);

// DELETE /worry/comment/:cid
router.delete("/:cid", [param("cid").isNumeric()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  //  const uid = req.session;
  const uid = 1;
  const cid = req.param.cid;

  const {
    error,
    result: comment,
  } = await req.container.worryService.getComment(cid);

  if (error) next(new Error(error));
  else if (c.UID != uid) next(new Error("Authentication Error"));
  else {
    const { error, result } = req.container.worryService.deleteComment(cid);
    if (error) next(new Error(error));
    else res.json({ result });
  }
});

/* ------------------- Bookmark --------------------- */

// GET /worry/bookmark/:wid
router.get(
  "/bookmark/:wid",
  [param("wid").isNumeric()],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const uid = req.uid;
    const wid = req.params.wid;
    const { error, result } = await req.container.worryService.isBookmarked(
      uid,
      wid
    );

    if (error) return next(new Error(error));
    else res.json({ result });
  }
);

// POST /worry/bookmark/:wid
router.post(
  "/bookmark/:wid",
  [param("wid").isNumeric()],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const uid = req.uid;
    const wid = req.params.wid;
    const { error, result } = await req.container.worryService.bookmark(
      uid,
      wid
    );

    if (error) return next(new Error(error));
    else res.json({ result });
  }
);

module.exports = router;
