const express = require("express");
const router = express.Router();
const multer = require("multer");

const { body, validationResult } = require("express-validator");

// POST /user/login
router.post(
  "/login",
  [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty(),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const { error, uid } = await req.container.userService.login(
      req.body.username,
      req.body.password
    );

    if (error) next(new Error(error));
    else {
      req.session.uid = uid;
      res.json({ uid });
    }
  }
);

// POST /user/signup
router.post(
  "/signup",
  [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty(),
    body("email").isEmail().optional({ checkFalsy: true }),
    body("phone").isMobilePhone().optional({ checkFalsy: true }),
  ],
  async (req, res, next) => {
    if (!validationResult(req).isEmpty())
      return next(new Error("Parameter Error"));

    const file = req.file;
    const { username, password } = req.body;
    const email = req.body.email || "";
    const phone = req.body.phone || "";
    const { error, uid } = await req.container.userService.signup({
      username,
      password,
      email,
      phone,
      file,
    });

    if (error) next(new Error(error));
    else res.json({ uid });
  }
);

// GET /user/logined
router.get("/logined", (req, res, next) => {
  if (req.uid) res.json({ result: true });
  else res.json({ result: false });
});

// GET /user/logout
router.get("/logout", (req, res, next) => {
  delete req.session.uid;
  res.json({ result: true });
});

// GET /user/profile
router.get("/profile", async (req, res, next) => {
  const uid = req.uid;

  if (uid == undefined) next(new Error("Login First!!"));
  const { error, result } = await req.container.userService.profile(uid);

  if (error) next(new Error(error));
  else res.json({ result });
});

module.exports = router;
