const Connection = require("./mysql");

module.exports = {
  // TODO Crypto of password
  login: (username, password) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM User WHERE username="${username}" AND password="${password}"`;
      Connection.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else if (rows[0]) resolve(rows[0].UID);
        else reject("Error: There's no user");
      });
    }),
  signup: (userData) =>
    new Promise((resolve, reject) => {
      const sql = `INSERT INTO petmeeting.User SET ?`;
      Connection.get().query(sql, userData, (err, rows) => {
        if (err) reject(err);
        else resolve(rows.insertId);
      });
    }),
};
