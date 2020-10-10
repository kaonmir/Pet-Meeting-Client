const mysql = require("mysql");

class MySQL {
  static set(conn) {
    MySQL.connection = conn;
    MySQL.connection.connect();
    console.log("MySQL Connecting Successfully");
  }
  static get() {
    return MySQL.connection;
  }
  static createConnection(MySQLOption) {
    MySQL.set(mysql.createConnection(MySQLOption));
  }
}

module.exports = MySQL;
