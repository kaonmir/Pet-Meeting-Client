const Connection = require("./mysql");

module.exports = {
  best: () =>
    new Promise((reslove, reject) => {
      // Later, 저거 명령문 해킹 방지하기

      const _m = new Date();
      const date = `${_m.getFullYear()}-${_m.getMonth()}-${_m.getDate()}`;
      console.log(date);
      const sql = `SELECT s.ImgUrl, s.Text, s.Date, COUNT(v.UID) AS Votes, u.Username
                    FROM petmeeting.Showoff AS s
                    LEFT JOIN petmeeting.Vote AS v ON s.SID = v.SID
                    JOIN petmeeting.User AS u ON s.UID = u.UID
                    WHERE s.Date > str_to_date('${date}', '%Y-%m-%d')
                    GROUP BY s.SID ORDER BY Votes DESC LIMIT 1`;
      Connection.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else {
          console.log(rows);
          reslove(rows[0]);
        }
      });
    }),
};
