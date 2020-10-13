const express = require("express");
const router = express.Router();
const response = require("../services/response");
const session = require("../services/session");
const { formatTime } = require("../services/format");
const MySQL = require("../api/mysql");
const model = require("../model/model");
const { posix } = require("path");

function prom(res, promise) {
  promise
    .then((result) => res.json(response.success(result)))
    .catch((err) => res.status(400).json(response.fail(err)));
}

function posInt(num) {
  num = Number(num);
  if (!isNaN(num) && num > 0) return num;
  else return 0;
}

/* ------------------- Pet choosing ---------------- */

router.get("/pet", (req, res) => {
  const limit = req.query.limit || 6;
  const offset = req.query.offset || 0;
  console.log("ads");
  MySQL.query(
    `SELECT * FROM petmeeting.PetView WHERE !isnull(EID)`
  ).then((rows) => res.json(response.success(rows)));
});

/* ------------------- Entrusting  ---------------- */

router.get("/list", (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  prom(entrust.list(limit, offset));
});

router.get("/:eid", (req, res) => {
  const eid = Number(req.params.eid);

  if (!isNaN(eid) && eid > 0)
    MySQL.get("Entrust", "EID", eid)
      .then((result) => {
        MySQL.list("Housings", 100, 0, [{ name: "EID", value: eid }])
          .then((array) => {
            result.Housings = array.map((v) => v.HousingID);
            res.json(response.success(result));
          })
          .catch((err) => {
            console.log(err);
            res.json(response.fail(err));
          });
      })
      .catch((err) => {
        console.log(err);
        res.json(response.fail(err));
      });
  else res.json(response.fail("EID is wrong"));
});

// TODO!!
// Pet에도 간섭해야 하고 Housing에도 간섭해야 한다.
router.post("/", (req, res) => {
  const errors = model.entrust.validate(req.body);

  const housingIDs = req.body.HousingIDs;
  delete req.body.HousingIDs;

  req.body.CreatedDate = formatTime(new Date());
  req.body.UID = session.getUID(req);

  if (errors.length != 0) res.status(400).json(response.fail(errors[0]));
  else
    MySQL.write("Entrust", req.body)
      .then((eid) => {
        Promise.all(
          housingIDs.map((housingID) =>
            MySQL.write("Housings", { EID: eid, HousingID: housingID })
          )
        )
          .then(res.json(response.success({ PID: eid })))
          .catch((err) => res.json(response.fail(err)));
      })
      .catch((err) => res.json(response.fail(err)));
});

router.put("/:eid", (req, res) => {
  const errors = model.entrust.validate(req.body);

  const housingIDs = req.body.HousingIDs;
  delete req.body.HousingIDs;

  const eid = posInt(req.params.eid);
  if (eid == 0) res.json(response.fail("EID is wrong"));
  else {
    MySQL.get("entrust", "EID", eid)
      .then((result) => {
        if (result.UID != session.getUID())
          res.json(response.fail("Authorizaion Error"));
        else
          MySQL.update("entrust", req.body, "EID", eid).then(() => {
            MySQL.delete("Housings", "EID", eid).then(() => {
              Promise.all(
                housingIDs.map((housingID) =>
                  MySQL.write("Housings", { EID: eid, HousingID: housingID })
                )
              )
                .then(res.json(response.success({ PID: eid })))
                .catch((err) => res.json(response.fail(err)));
            });
          });
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
