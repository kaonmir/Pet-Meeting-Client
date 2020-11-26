class Chat {
  constructor(client) {
    this.client = client;
  }

  async lrange(chatID, property, offset, limit) {
    var result, error;
    await new Promise((resolve, reject) =>
      this.client.LRANGE(
        `${chatID}:${property}`,
        -1 - limit,
        -1 - offset,
        (err, reply) => (err ? reject(err) : resolve(reply))
      )
    )
      .then((reply) => (result = reply))
      .catch((err) => (error = err));

    return { result, error };
  }

  async rpush(chatID, property, value) {
    var result, error;
    await new Promise((resolve, reject) => {
      this.client.RPUSH(`${chatID}:${property}`, value, (err, reply) =>
        err ? reject(err) : resolve()
      );
    })
      .then(() => (result = true))
      .catch((err) => (error = err));

    return { result, error };
  }

  async getChatID(uid1, uid2) {
    return `${Math.min(uid1, uid2)}-${Math.max(uid1, uid2)}`;
  }

  async list(chatID, offset, limit) {
    const { error: e1, result: writers } = await this.lrange(
      chatID,
      "writers",
      limit,
      offset
    );
    const { error: e2, result: messages } = await this.lrange(
      chatID,
      "messages",
      limit,
      offset
    );
    const { error: e3, result: dates } = await this.lrange(
      chatID,
      "dates",
      limit,
      offset
    );

    if (e1 || e2 || e3) return { error: e1 || e2 || e3 };

    var result = [];
    for (var idx = 0; idx < writers.length; idx++)
      result.push({
        writer: writers[idx],
        message: messages[idx],
        date: dates[idx],
      });

    return { result };
  }

  async _scan(cursor, pattern) {
    var result, error;
    await new Promise((resolve, reject) => {
      this.client.scan(
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
            _scan(reply[0], pattern)
              .then((result) => {
                result.forEach((v) => answer.push(v));
                resolve(answer);
              })
              .catch((err) => reject(err));
        }
      );
    })
      .then((answer) => (result = answer))
      .catch((err) => (error = err));

    return { error, result };
  }

  async members(uid) {
    const { error: e1, result: r1 } = await this._scan("0", `${uid}-*:writers`);
    const { error: e2, result: r2 } = await this._scan("0", `*-${uid}:writers`);

    if (e1 || e2) return { error: e1 || e2 };

    var result = [];
    var reg1 = /(?:\d+)-(\d+):writers/;
    var reg2 = /(\d+)-(?:\d+):writers/;
    r1.forEach((v) => result.push(Number(v.match(reg1)[1])));
    r2.forEach((v) => result.push(Number(v.match(reg2)[1])));

    return { result };
  }

  async chat(chatID, writer, date, message) {
    const { error: e1 } = await this.rpush(chatID, "writers", writer);
    const { error: e2 } = await this.rpush(chatID, "dates", date);
    const { error: e3 } = await this.rpush(chatID, "messages", message);

    if (e1 || e2 || e3) return { error: e1 || e2 || e3 };
    else return { result: true };
  }
}

module.exports = Chat;
