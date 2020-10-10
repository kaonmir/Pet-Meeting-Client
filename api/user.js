const MySQL = require("./mysql");

module.exports = {
  // TODO Crypto of password
  login: (username, password) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM User WHERE username="${username}" AND password="${password}"`;
      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else if (rows[0]) resolve(rows[0].UID);
        else reject("Error: There's no user");
      });
    }),
  signup: (userData) =>
    new Promise((resolve, reject) => {
      const sql = `INSERT INTO petmeeting.User SET ?`;
      MySQL.get().query(sql, userData, (err, rows) => {
        if (err) reject(err);
        else resolve(rows.insertId);
      });
    }),
  exists: (uid) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM petmeeting.User WHERE UID='${uid}'`;
      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else if (rows.length == 1) resolve(true);
        else resolve(false);
      });
    }),
};
