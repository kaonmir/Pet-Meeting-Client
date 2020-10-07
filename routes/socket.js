// {{BASE_URL}}/chat
// 채팅 자동 업데이트는 나중에 (SideBar)
// 정직하게 http loading 후 채팅 그림을 클릭하면 그때 socket 연결함.

const express = require("express");
const chat = require("../api/chat");
const Redis = require("../api/redis");

const response = require("../response");
const { formatTime } = require("../services/format");

var clientSocket = {};

module.exports = (socket) => {
  console.log("Connected!");

  socket.on("send_id", (data) => {
    const uid = data.uid;
    if (clientSocket[uid] == undefined) {
      clientSocket[uid] = socket;
      socket.uid = uid;
      console.log(`Connect with UID ${uid}`);
    }
  });

  socket.on("disconnect", () => {
    clientSocket[socket.uid] = undefined;
    console.log(`Disconnected ${socket.uid}!`);
  });

  socket.on("chat", (data) => {
    const uid1 = socket.uid;

    if (uid1 == undefined) {
      socket.emit("message", { message: "Login First" });
      return;
    }

    const uid2 = data.uid;
    const message = data.message;

    const chatID = chat.getChatID(uid1, uid2);
    const date = formatTime(new Date());

    // ClientSocket[uid1]과 지금 socket이 동일한가

    if (uid1 == uid2)
      socket.emit("message", { message: "Sender and Reciever is same!!" });
    else {
      chat.chat(chatID, uid1, date, message);

      data = { ...data, date: date, chatID: chatID };
      clientSocket[Number(uid2)].emit("chat", JSON.stringify(data));
    }
  });
};
