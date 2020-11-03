const express = require("express");
const router = express.Router();

const { body, param, query, validationResult } = require("express-validator");
const { formatTime } = require("../services/format");

// GET /entrust/pets
router.get(
  "/pets",
  [
    query("limit").isNumeric().notEmpty(),
    query("offset").isNumeric().notEmpty(),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const uid = req.uid;
    const { offset, limit } = req.query;
    const {
      error,
      result,
    } = await req.container.entrustService.listEntrustablePets(
      uid,
      offset,
      limit
    );
    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// GET /entrust/info
router.get("/info", async (req, res, next) => {
  const { error, result } = await req.container.entrustService.getInfo();

  if (error) next(new Error(error));
  else res.json({ result });
});

// GET /entrust (list entrust application)
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
    const { error, result } = await req.container.entrustService.list(
      offset,
      limit
    );

    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// GET /entrust/:eid
router.get(
  "/:eid",
  [param("eid").isNumeric().notEmpty()],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const eid = req.params.eid;
    const { error, result } = await req.container.entrustService.get(eid);

    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// POST /entrust
router.post(
  "/",
  [
    body("text").isString().notEmpty(),
    body("startDate").isDate().notEmpty(),
    body("endDate").isDate().notEmpty(),
    body("toyPayment").isNumeric().notEmpty(),
    body("cityId").isNumeric().notEmpty(),
    body("housings").isArray().notEmpty(),
    body("pets").isArray().notEmpty(),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const uid = req.uid;
    const createdDate = formatTime(new Date());
    const { text, startDate, endDate, toyPayment } = req.body;
    const { cityId, housings, pets } = req.body;

    const { error, result } = await req.container.entrustService.create(
      {
        text,
        startDate,
        endDate,
        toyPayment,
        cityId,
        createdDate,
        uid,
      },
      housings,
      pets
    );

    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// PUT /entrust/:eid
router.put(
  "/:eid",
  [
    param("eid").isNumeric().notEmpty(),
    body("text").isString().optional({ checkFalsy: true }),
    body("startDate").isDate().optional({ checkFalsy: true }),
    body("endDate").isDate().optional({ checkFalsy: true }),
    body("toyPayment").isNumeric().optional({ checkFalsy: true }),
    body("cityId").isNumeric().optional({ checkFalsy: true }),
    body("housings").isArray().optional({ checkFalsy: true }),
    body("pets").isArray().optional({ checkFalsy: true }),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const uid = req.uid;
    const eid = req.params.eid;

    const { text, startDate, endDate, toyPayment } = req.body;
    const { cityId, housings, pets } = req.body;

    const {
      error: e1,
      result: entrust,
    } = await req.container.entrustService.get(eid);

    if (e1) return next(new Error(e1));
    else if (entrust.UID != uid)
      return next(new Error("Authentication Error!"));

    const { error, result } = await req.container.entrustService.update(
      eid,
      {
        text,
        startDate,
        endDate,
        toyPayment,
        cityId,
      },
      housings,
      pets
    );

    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// DELETE /entrust/:eid
router.delete("/:eid", [param("eid").isNumeric()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  const uid = req.uid;
  const eid = req.params.eid;

  const { error: e1, result: entrust } = await req.container.entrustService.get(
    eid
  );
  if (e1) return next(new Error(e1));
  else if (entrust.UID != uid) return next(new Error("Authentication Error!"));

  const { error, result } = await req.container.entrustService.delete(eid);
  if (error) next(new Error(error));
  else res.json({ result });
});

module.exports = router;
