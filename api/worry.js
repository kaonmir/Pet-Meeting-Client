const Connection = require("./mysql");

module.exports = {
  list: (limit, offset) =>
    new Promise((reslove, reject) => {
      // Later, 저거 명령문 해킹 방지하기

      const sql = `SELECT w.Title, w.Text, u.Username FROM petmeeting.Worry AS w
                  JOIN petmeeting.User AS u ON w.UID = u.UID ORDER BY w.Date DESC LIMIT ${limit} OFFSET ${offset}`;
      Connection.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else {
          console.log(rows);
          reslove(rows);
        }
      });
    }),
};
