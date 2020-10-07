// /chat
const express = require("express");
const user = require("../api/user");
const chat = require("../api/chat");
const response = require("../response");
const router = express.Router();
const Response = require("../response");
const session = require("../services/session");
const { formatTime } = require("../services/format");

router.get("/list/:uid", (req, res) => {
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;
  const uid1 = session.getUID();
  const uid2 = Number(req.params.uid); // oponent's uid

  if (uid1 == uid2) res.json(response.fail("It's same UID!!"));
  else if (isNaN(uid2) || uid2 < 0) res.json(response.fail("UID is wrong"));
  else {
    const chatID = chat.getChatID(uid1, uid2);
    chat
      .list(chatID, limit, offset)
      .then((chats) => res.json(response.success(chats)))
      .catch((err) => res.json(response.fail("Database Error")));
  }
});

// Chatting하기
router.post("/:uid", (req, res) => {
  const uid1 = session.getUID();
  const uid2 = Number(req.params.uid);
  const message = req.body.message;

  if (isNaN(uid2) || uid2 < 0) res.json(response.fail("UID is wrong"));
  else if (message == undefined) res.json(response.fail("No message exists"));
  else {
    user
      .exists(uid2)
      .then((result) => {
        if (!result) res.json(response.fail("No user exists using this UID"));
        else {
          const chatID = chat.getChatID(uid1, uid2);
          const date = formatTime(new Date());
          chat
            .chat(chatID, uid1, date, message)
            .then(() => res.json(response.success()))
            .catch((err) => res.json(response.fail("Database Error")));
        }
      })
      .catch((err) => res.json(response.fail("Database Error")));
  }
});

module.exports = router;
