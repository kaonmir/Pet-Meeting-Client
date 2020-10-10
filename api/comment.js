const MySQL = require("./mysql");

module.exports = {
  list: (wid, limit, offset) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT c.CID, c.Text, c.Date, c.CID_ReplyTo, u.UID, u.Username FROM petmeeting.Comment AS c
                    LEFT JOIN petmeeting.User AS u ON c.UID=u.UID WHERE WID='${wid}' 
                    ${limit ? `LIMIT ${limit}  OFFSET ${offset}` : ""}`;

      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  comment: (text, date, wid, uid) =>
    new Promise((resolve, reject) => {
      const option = {
        Text: text,
        Date: date,
        WID: wid,
        UID: uid,
      };
      const sql = `INSERT INTO petmeeting.Comment SET ?`;

      MySQL.get().query(sql, option, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
  recomment: (text, date, cid, wid, uid) =>
    new Promise((resolve, reject) => {
      const option = {
        Text: text,
        Date: date,
        CID_ReplyTo: cid,
        UID: uid,
        WID: wid,
      };
      const sql = `INSERT INTO petmeeting.Comment SET ?`;

      MySQL.get().query(sql, option, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
  get: (cid) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT c.CID, c.Text, c.Date, c.CID_ReplyTo, c.WID, u.UID, u.Username
                  FROM petmeeting.Comment AS c
                  LEFT JOIN petmeeting.User AS u ON c.UID=u.UID WHERE CID='${cid}'`;

      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    }),
  update: (cid, text) =>
    new Promise((resolve, reject) => {
      const sql = `UPDATE petmeeting.Comment SET Text='${text}' WHERE CID='${cid}'`;

      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows); // true is true?
      });
    }),

  // When delete comment, all re-comment of this comment will be erased.
  delete: (cid) =>
    new Promise((resolve, reject) => {
      const sql = `DELETE FROM petmeeting.Comment WHERE CID='${cid}'`;

      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows); // true is true?
      });
    }),
};
