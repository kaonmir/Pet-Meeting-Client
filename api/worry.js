const Connection = require("./mysql");

module.exports = {
  list: (limit, offset) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT w.WID, w.Title, w.Text, u.Username FROM petmeeting.Worry AS w
                  JOIN petmeeting.User AS u ON w.UID = u.UID ORDER BY w.Date DESC LIMIT ${limit} OFFSET ${offset}`;
      Connection.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }), // Date: String
  write: (title, text, date, uid) =>
    new Promise((resolve, reject) => {
      const option = {
        Title: title,
        Text: text,
        Date: date,
        UID: uid,
      };

      const sql = `INSERT INTO petmeeting.Worry SET ?`;
      Connection.get().query(sql, option, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
  get: (wid) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM petmeeting.Worry WHERE WID='${wid}'`;

      Connection.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    }),
  delete: (wid) =>
    new Promise((resolve, reject) => {
      const sql = `DELETE FROM petmeeting.Worry WHERE WID='${wid}'`;

      Connection.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
};
