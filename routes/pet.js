const express = require("express");
const router = express.Router();
const multer = require("../api/multer");
const pet = require("../api/pet");
const response = require("../services/response");
const session = require("../services/session");

router.get("/list", (req, res) => {
  const limit = req.query.limit || 20;
  const offset = req.query.offset || 0;

  pet
    .list(limit, offset)
    .then((result) => res.json(response.success(result)))
    .catch((err) => res.json(response.fail("Database Error")));
});

router.get("/:pid", (req, res) => {
  const pid = Number(req.params.pid);
  if (!isNaN(pid) && pid > 0)
    pet
      .get(pid)
      .then((result) => res.json(response.success(result)))
      .catch((err) => res.json(response.fail("Database Error")));
  else res.json(response.fail("PID is wrong"));
});

// Write showoff post
router.post("/", multer.single("img"), (req, res) => {
  const uid = session.getUID();
  const { name, genderID, description, breedID } = req.body;
  const year = Number(req.body.year);
  const file = req.file;

  if (file == undefined) res.json(response.fail("There's no image!!"));
  else if (isNaN(year) || year <= 0) res.json(response.fail("Year is wrong"));
  else if (!name || !year || !genderID || !description || !breedID)
    res.json(response.fail("Fill in the blank completely!!"));
  else {
    multer
      .upload(file)
      .then((imgID) =>
        pet
          .write(name, year, genderID, description, breedID, uid, imgID)
          .then((result) =>
            res.json(response.success({ PID: result.insertId }))
          )
          .catch((_err) => res.json(response.fail("Database Error")))
      )
      .catch((_err) => res.json(response.fail("Database Error")));
  }
});

// 매번 image를 올리지 않게 해서 performance를 높이자!
router.put("/:pid", multer.single("img"), (req, res) => {
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
    pet.get(pid).then((result) => {
      if (result.UID != uid) res.json(response.fail("Authorizaion Error"));
      else
        multer
          .upload(file)
          .then((imgID) => {
            pet
              .update(pid, name, year, genderID, description, breedID, imgID)
              .then((result) => res.json(response.success()))
              .catch((_err) => res.json(response.fail("Database Error")));
          })
          .catch((_err) => res.json(response.fail("Database Error")));
    });
  }
});

router.delete("/:pid", (req, res) => {
  const pid = Number(req.params.pid);

  // Check whether pid is valid or not
  if (!isNaN(pid) && pid > 0) {
    const uid = session.getUID(req);
    pet
      .get(pid)
      .then((result) => {
        // Check whether uid is valid or not
        if (result.UID != uid) res.json(response.fail("Authorizaion Error"));
        else
          pet
            .delete(pid)
            .then(() => res.json(response.success()))
            .catch((err) => res.json(response.fail("Database Error")));
      })
      .catch((err) => res.json(response.fail("Database Error")));
  } else res.json(response.fail("PID is wrong"));
});

module.exports = router;
