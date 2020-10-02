const Connection = require("./mysql");

module.exports = {
  worries: (top) =>
    new Promise((reslove, reject) => {
      // Later, 저거 명령문 해킹 방지하기
      const sql = `SELECT Title, Text FROM petmeeting.Worry ORDER BY Date DESC LIMIT ${top}`;
      Connection.get().query(sql, (err, rows) =>
        err ? reject(err) : reslove(rows)
      );
    }),
};
