const express = require("express");
const router = express.Router();

// import router
const user = require("./user");
const special = require("./special");
const showoff = require("./showoff");
const entrust = require("./entrust");
const worry = require("./worry");
const raise = require("./raise.js");

// To control all session flow
router.all("*", (req, res, next) => {
  // req.uid = req.session.uid;
  req.uid = 2;
  next();
});

router.use("/user", user);

// User logined
router.all("*", (req, res, next) => {
  if (req.uid) next();
  else next(new Error("Login First!!"));
});

router.use("/showoff", showoff);
router.use("/entrust", entrust);
router.use("/worry", worry);
router.use("/raise", raise);
router.use("/", special);

// Error Handling

router.use(function (error, req, res, next) {
  res.status(400).json({ message: error.message });
});

// Export
module.exports = router;
