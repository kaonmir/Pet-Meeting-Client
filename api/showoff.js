const Connection = require("./mysql");

module.exports = {
  list: (limit, offset) =>
    new Promise((reslove, reject) => {
      // Later, 저거 명령문 해킹 방지하기

      const sql = `SELECT s.Title, s.Text, s.ImgUrl, u.Username FROM petmeeting.Showoff AS s
                  JOIN petmeeting.User AS u ON s.UID = u.UID ORDER BY s.Date DESC LIMIT ${limit} OFFSET ${offset}`;
      Connection.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else {
          console.log(rows);
          reslove(rows);
        }
      });
    }),
};
