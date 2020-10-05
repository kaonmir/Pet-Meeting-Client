const express = require("express");
const worries = require("../api/worry");
const response = require("../response");
const router = express.Router();

router.get("/setID", (req, res) => {
  const id = Math.ceil(Math.random() * 1000);
  req.session.UID = `${id}`;
  res.end(`${id}`);
});

router.get("/getID", (req, res) => {
  const id = req.session.UID;
  res.end(id);
});

module.exports = router;
