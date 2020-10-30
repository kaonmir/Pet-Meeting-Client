// 채팅 자동 업데이트는 나중에 (SideBar)
// 정직하게 http loading 후 채팅 그림을 클릭하면 그때 socket 연결함.

const { formatTime } = require("./format");
class SocketService {
  constructor(chatModel) {
    this.chatModel = chatModel;
  }

  static clientSocket = {};

  error(socket, message) {
    socket.emit("message", { message });
    return;
  }

  connect(socket) {
    console.log("Connected!");

    socket.on("disconnect", () => {
      SocketService.clientSocket[socket.uid] = undefined;
      console.log(`Disconnected ${socket.uid}!`);
    });

    socket.on("login", () => {
      const uid = socket.handshake.session.UID;
      if (uid == undefined) return this.error(socket, "Login First!");

      SocketService.clientSocket[uid] = socket;
      socket.uid = uid;
      console.log(`Connect with UID ${uid}`);

      socket.on("chat", async (data) => {
        const senderId = socket.uid;
        const { receiverId, message } = data;

        if (receiverId == undefined || message == undefined)
          return this.error(socket, "Parameter Error!");
        else if (senderId == receiverId)
          return this.error(socket, "Sender Reciever are same");

        const chatID = await this.chatModel.getChatID(senderId, receiverId);
        const date = formatTime(new Date());

        // Store this chat to Redis server
        const { error } = await this.chatModel.chat(
          chatID,
          senderId,
          date,
          message
        );

        if (error) socket.emit("message", { message: error });
        else {
          // return for sender
          socket.emit("chat", { senderId, receiverId, message });

          // send chat for receiver
          const receiverSocket = SocketService.clientSocket[receiverId];
          if (receiverSocket)
            receiverSocket.emit("chat", { senderId, receiverId, message });
        }
      });
    });
  }
  /**
   * connection {}
   * disconnect {}
   * login      {}
   * chat       {uid, }
   */
}

module.exports = SocketService;
