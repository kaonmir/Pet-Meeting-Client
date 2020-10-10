const express = require("express");
const chat = require("../api/chat");
const Redis = require("../api/redis");
const multer = require("../api/multer");
const MySQL = require("../api/mysql");
const showoff = require("../api/showoff");
const router = express.Router();

router.get("/get", (req, res) => {
  Redis.client.get("sadk", (err, reply) => {
    console.log(reply);
    if (err) console.log(err);
    else console.log(reply);
    res.end("");
  });
});

router.get("/list/:uid", (req, res) => {
  const uid = req.params.uid;
  var a = [1, 2, 3];
  console.log(a.map((v) => v + 3).join("-"));

  res.end("");
});

router.post("/image", multer.single("img"), (req, res) => {
  res.json({ a: req.file, b: req.body });
  res.end("");
});

router.post("/upload", multer.single("img"), (req, res) => {
  res.json(req.file);
});

module.exports = router;
