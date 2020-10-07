const express = require("express");
const Redis = require("../api/redis");
const router = express.Router();

router.get("/get", (req, res) => {
  Redis.client.get("sadk", (err, reply) => {
    console.log(reply);
    if (err) console.log(err);
    else console.log(reply);
  });
});

module.exports = router;
