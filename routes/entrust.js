const express = require("express");
const router = express.Router();
const Schema = require("../model/entrust");
const entrust = require("../api/entrust.js");
const response = require("../services/response");
const session = require("../services/session");
const { formatTime } = require("../services/format");

router.get("/list", (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  entrust
    .list(limit, offset)
    .then((result) => res.json(response.success(result)))
    .catch((err) => res.json(response.fail("Database Error")));
});

router.get("/:eid", (req, res) => {
  const eid = Number(req.params.eid);
  if (!isNaN(eid) && eid > 0)
    entrust
      .get(eid)
      .then((result) => res.json(response.success(result)))
      .catch((err) => res.json(response.fail("Database Error")));
  else res.json(response.fail("EID is wrong"));
});

// TODO!!
// Pet에도 간섭해야 하고 Housing에도 간섭해야 한다.
router.post("/", (req, res) => {
  console.log(req.body);
  const uid = session.getUID(req);
  const { housingIDs } = req.body;
  const errors = Schema.entrust.validate(req.body);
  const {
    text,
    start_date,
    end_date,
    preypayment,
    toypayment,
    cityID,
  } = req.body;
  const created_date = formatTime(new Date());

  if (errors.length != 0) res.status(400).json(response.fail(errors[0]));
  else
    entrust
      .write(
        text,
        start_date,
        end_date,
        preypayment,
        toypayment,
        cityID,
        created_date,
        uid
      )
      .then((result) => {
        const eid = result.insertId;
        Promise.all(
          housingIDs.map((housingID) => entrust.addHousing(eid, housingID))
        )
          .then(res.json(response.success({ PID: eid })))
          .catch((_err) => res.json(response.fail("Database Error")));
      })
      .catch((_err) => res.json(response.fail("Database Error")));
});

// 매번 image를 올리지 않게 해서 performance를 높이자!
router.put("/:pid", (req, res) => {
  const pid = Number(req.params.pid);
  const year = Number(req.body.year);
  const { name, genderID, description, breedID } = req.body;
  const uid = session.getUID();
  const file = req.file;

  if (file == undefined) res.json(response.fail("There's no image!!"));
  else if (isNaN(year) || year <= 0) res.json(response.fail("Year is wrong"));
  else if (!name || !year || !genderID || !description || !breedID)
    res.json(response.fail("Fill in the blank completely!!"));
  else if (isNaN(pid) || pid <= 0) res.json(response.fail("PID is wrong"));
  else {
    entrust
      .get(pid)
      .then((result) => {
        if (result.UID != uid) res.json(response.fail("Authorizaion Error"));
        else
          entrust
            .update(pid, name, year, genderID, description, breedID, imgID)
            .then((result) => res.json(response.success()))
            .catch((_err) => res.json(response.fail("Database Error")));
      })
      .catch((_err) => res.json(response.fail("Database Error")));
  }
});

router.delete("/:eid", (req, res) => {
  const eid = Number(req.params.eid);

  if (!isNaN(eid) && eid > 0) {
    const uid = session.getUID(req);
    pet
      .get(eid)
      .then((result) => {
        if (result.UID != uid) res.json(response.fail("Authorizaion Error"));
        else
          entrust
            .delete(eid)
            .then(() => res.json(response.success()))
            .catch((err) => res.json(response.fail("Database Error")));
      })
      .catch((err) => res.json(response.fail("Database Error")));
  } else res.json(response.fail("EID is wrong"));
});

module.exports = router;
