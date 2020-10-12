const MySQL = require("./mysql");

module.exports = {
  best: () =>
    new Promise((resolve, reject) => {
      // Later, 저거 명령문 해킹 방지하기

      const _m = new Date();
      const month = _m.getMonth() != 0 ? _m.getMonth() : 12; // 한 달 빼주기
      const date = `${_m.getFullYear()}-${month}-${_m.getDate()}`;

      const sql = `SELECT s.SID, s.Text, s.Date, s.UID, u.Username, i.Filename, COUNT(v.SID) AS Votes
                    FROM petmeeting.Showoff AS s
                    JOIN petmeeting.User AS u ON s.UID = u.UID
                    JOIN petmeeting.Image AS i ON s.ImgID = i.ImgID
                    LEFT JOIN petmeeting.Vote AS v ON s.SID = v.SID
                    WHERE s.Date > str_to_date('${date}', '%Y-%m-%d')
                    GROUP BY s.SID ORDER BY Votes DESC LIMIT 1;`;
      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    }),

  /* --------------------- Vote ---------------------*/

  vote: (sid, uid) =>
    new Promise((resolve, reject) => {
      const sql = `INSERT INTO petmeeting.Vote SET UID='${uid}', SID='${sid}'`;

      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
  unvote: (sid, uid) =>
    new Promise((resolve, reject) => {
      const sql = `DELETE FROM petmeeting.Vote WHERE UID='${uid}' AND SID='${sid}'`;

      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  voted: (sid, uid) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM petmeeting.Vote WHERE UID='${uid}' AND SID='${sid}'`;

      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows.length == 1);
      });
    }),
};
