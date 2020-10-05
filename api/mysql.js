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
  static createConnection(MySQLOption) {
    Connection.set(mysql.createConnection(MySQLOption));
  }
}

module.exports = Connection;
