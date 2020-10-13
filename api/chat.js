const { RedisClient } = require("redis");
const MySQL = require("./mysql");
const Redis = require("./redis");

function lrange(chatID, property, limit, offset) {
  return new Promise((resolve, reject) =>
    Redis.client.LRANGE(
      `${chatID}:${property}`,
      -1 - limit,
      -1 - offset,
      (err, reply) => (err ? reject(err) : resolve(reply))
    )
  );
}
function rpush(chatID, property, value) {
  console.log("rpushing");
  return new Promise((resolve, reject) => {
    if (value == undefined) reject(`Undefinded value on ${chatID}:${property}`);
    // SET 처럼 같다고 사라지지 않기 때문에 resolve면 true다.
    else
      Redis.client.RPUSH(`${chatID}:${property}`, value, (err, reply) =>
        err ? reject(err) : resolve()
      );
  });
}

function scan(cursor, pattern) {
  return new Promise((resolve, reject) => {
    Redis.client.scan(
      `${cursor}`,
      "MATCH",
      `${pattern}`,
      "COUNT",
      "100",
      (err, reply) => {
        var answer = reply[1];

        if (err) reject(err);
        else if (reply[0] == "0") resolve(answer);
        else
          scan(reply[0], pattern)
            .then((result) => {
              result.forEach((v) => answer.push(v));
              resolve(answer);
            })
            .catch((err) => reject(err));
      }
    );
  });
}

// IMPORTANT! final uid1 is always smaller than uid2

module.exports = {
  getChatID: (uid1, uid2) => `${Math.min(uid1, uid2)}-${Math.max(uid1, uid2)}`,
  //두 사용자 간의 채팅 방 만들기
  // TODO: MySQL의 ChatWith에 추가
  // TOOD: Redis에 각각 정보 추가.
  // TODO: 둘을 연결하는 ChatID를 고유하게 발급 => uid1, uid2

  list: (chatID, limit, offset) =>
    Promise.all([
      lrange(chatID, "writers", limit, offset),
      lrange(chatID, "messages", limit, offset),
      lrange(chatID, "dates", limit, offset),
    ]).then((values) => {
      var result = [];
      for (var idx = 0; idx < values[0].length; idx++)
        result.push({
          writer: values[0][idx],
          message: values[1][idx],
          date: values[2][idx],
        });
      return result;
    }),
  chat: (chatID, writer, date, message) =>
    Promise.all([
      rpush(chatID, "writers", writer),
      rpush(chatID, "dates", date),
      rpush(chatID, "messages", message),
    ]),

  scan: (uid) =>
    new Promise((resolve, reject) => {
      scan("0", `${uid}-*:writers`)
        .then((result1) => {
          scan("0", `*-${uid}:writers`)
            .then((result2) => {
              var answer = [];
              var reg1 = /(?:\d+)-(\d+):writers/;
              var reg2 = /(\d+)-(?:\d+):writers/;
              result1.forEach((v) => answer.push(Number(v.match(reg1)[1])));
              result2.forEach((v) => answer.push(Number(v.match(reg2)[1])));
              resolve(answer);
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    }),
};
