const MySQL = require("./mysql");

module.exports = {
  list: (limit, offset) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT w.WID, w.Title, w.Text, u.Username FROM petmeeting.Worry AS w
                  JOIN petmeeting.User AS u ON w.UID = u.UID ORDER BY w.Date DESC LIMIT ${limit} OFFSET ${offset}`;
      MySQL.get().query(sql, (err, rows) => {
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
      MySQL.get().query(sql, option, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
  update: (wid, title, text) =>
    new Promise((resolve, reject) => {
      const option = {
        Title: title,
        Text: text,
      };

      const sql = `UPDATE petmeeting.Worry SET ? WHERE WID='${wid}'`;
      MySQL.get().query(sql, option, (err, rows) => {
        console.log(rows);
        // 뭐가 튀어나올지 궁금하군.
        if (err) reject(err);
        else resolve(rows);
      });
    }),
  get: (wid) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM petmeeting.Worry WHERE WID='${wid}'`;

      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    }),
  delete: (wid) =>
    new Promise((resolve, reject) => {
      const sql = `DELETE FROM petmeeting.Worry WHERE WID='${wid}'`;

      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  /* --------------------- Bookmark ---------------------*/
  bookmark: (wid, uid) =>
    new Promise((resolve, reject) => {
      const sql = `INSERT INTO petmeeting.BookMarkTo SET UID='${uid}', WID='${wid}'`;

      MySQL.get().query(sql, (err, rows) => {
        console.log(rows);
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  unbookmark: (wid, uid) =>
    new Promise((resolve, reject) => {
      const sql = `DELETE FROM petmeeting.BookMarkTo WHERE UID='${uid}' AND WID='${wid}'`;

      MySQL.get().query(sql, (err, rows) => {
        console.log(rows);
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  bookmarked: (wid, uid) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM petmeeting.BookMarkTo WHERE UID='${uid}' AND WID='${wid}'`;

      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows.length == 1);
      });
    }),
};
