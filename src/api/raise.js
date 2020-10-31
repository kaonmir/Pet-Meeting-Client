const express = require("express");
const router = express.Router();

const { body, param, validationResult } = require("express-validator");
const { formatTime } = require("../services/format");

// GET /raise/:rid
router.get("/:rid", [param("rid").isString()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  const rid = req.params.rid;
  const { error, result } = await req.container.raiseService.get(rid);
  if (error) next(new Error(error));
  else res.json({ result });
});

// POST /raise
router.post(
  "/",
  [
    body("motivation").isString(),
    body("carrierPeriod").isNumeric(),
    body("housingId").isNumeric(),
    body("eid").isNumeric(),
    body("cityId").isNumeric(),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const { motivation, carrierPeriod, housingId, eid, cityId } = req.body;

    //  const uid = req.session;
    const uid = 1;
    const date = formatTime(new Date());

    const { error, result } = await req.container.raiseService.create({
      motivation,
      carrierPeriod,
      housingId,
      date,
      uid,
      eid,
      cityId,
    });

    if (error) next(new Error(error));
    else res.json({ result });
  }
);

// PUT /raise/:rid
router.put(
  "/:rid",
  [
    param("rid").isNumeric(),
    body("motivation").isString(),
    body("carrierPeriod").isNumeric(),
    body("housingId").isNumeric(),
    body("cityId").isNumeric(),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const uid = req.uid;
    const rid = req.params.rid;
    const { motivation, carrierPeriod, housingId, cityId } = req.body;

    const { error: e, result: raise } = await req.container.raiseService.get(
      rid
    );

    if (e) next(new Error(e));
    else if (raise.UID != uid) next(new Error("Authentication Error"));
    else {
      const { error, result } = await req.container.raiseService.update(rid, {
        motivation,
        carrierPeriod,
        housingId,
        cityId,
      });

      if (error) next(new Error(error));
      else res.json({ result });
    }
  }
);

// DELETE /raise/:rid
router.delete("/:rid", [param("rid").isNumeric()], async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    return next(new Error("Parameter Error"));

  //  const uid = req.session;
  const uid = 1;
  const rid = req.params.rid;

  const { error: e, result: raise } = await req.container.raiseService.get(rid);
  if (e) next(new Error(e));
  else if (raise.UID != uid) next(new Error("Authentication Error"));
  else {
    const { error, result } = await req.container.raiseService.delete(rid);
    if (error) next(new Error(error));
    else res.json({ result });
  }
});

module.exports = router;
