const express = require("express");
const chat = require("../api/chat");
const Redis = require("../api/redis");
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

module.exports = router;
