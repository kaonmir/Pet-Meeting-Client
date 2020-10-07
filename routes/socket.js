// {{BASE_URL}}/chat
// 채팅 자동 업데이트는 나중에 (SideBar)
// 정직하게 http loading 후 채팅 그림을 클릭하면 그때 socket 연결함.

const express = require("express");
const Redis = require("../api/redis");
const response = require("../response");

module.exports = (socket) => {
  console.log("Connected!");
  socket.on("hello", (req) => {
    console.log(req);
    socket.emit("hello_re", { data: "first_re" });
  });
};
