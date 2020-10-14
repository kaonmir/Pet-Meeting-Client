// 채팅 자동 업데이트는 나중에 (SideBar)
// 정직하게 http loading 후 채팅 그림을 클릭하면 그때 socket 연결함.

const express = require("express");
const chat = require("../api/chat");
const Redis = require("../api/redis");

const response = require("../services/response");
const { formatTime } = require("../services/format");

var clientSocket = {};

// 보안 걱정
module.exports = (socket) => {
  console.log("Connected!");

  socket.on("send_id", (data) => {
    const uid = data.uid;
    // 같은 아이디로 다른 데서 채팅하면
    // 기존의 것은 사라진다...
    clientSocket[uid] = socket;
    socket.uid = uid;
    console.log(`Connect with UID ${uid}`);
  });

  socket.on("disconnect", () => {
    clientSocket[socket.uid] = undefined;
    console.log(`Disconnected ${socket.uid}!`);
  });

  socket.on("chat", (data) => {
    const uid_s = socket.uid;

    if (uid_s == undefined) {
      socket.emit("message", { message: "Login First" });
      return;
    }

    const uid_r = data.uid;
    const message = data.message;
    data.writer = uid_s;

    const chatID = chat.getChatID(uid_s, uid_r);
    const date = formatTime(new Date());

    // ClientSocket[uid_s]과 지금 socket이 동일한가
    if (uid_s == uid_r)
      socket.emit("message", { message: "Sender and Reciever is same!!" });
    else {
      chat.chat(chatID, uid_s, date, message).then(() => {
        data = { ...data, date: date, chatID: chatID };
        receiver = clientSocket[Number(uid_r)];
        if (receiver) receiver.emit("chat", JSON.stringify(data));
      });
    }
  });
};
