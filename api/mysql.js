const mysql = require("mysql");

class Connection {
  static connection;

  static set(conn) {
    Connection.connection = conn;
    Connection.connection.connect();
    console.log("Connecting Successfully");
  }
  static get() {
    return Connection.connection;
  }
}
module.exports = {
  createConnection: (MySQLOption) =>
    Connection.set(mysql.createConnection(MySQLOption)),

  // TODO Crypto of password
  login: (username, password) =>
    new Promise((reslove, reject) => {
      const sql = `SELECT * FROM User WHERE username="${username}" AND password="${password}"`;
      Connection.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else if (rows[0]) reslove(rows[0].UID);
        else reject("Error: There's no user");
      });
    }),
  signup: (userData) =>
    new Promise((reslove, reject) => {
      const sql = `INSERT INTO User SET ?`;
      Connection.get().query(sql, userData, (err, rows) => {
        if (err) reject(err);
        else reslove(rows.insertId);
      });
    }),
};
