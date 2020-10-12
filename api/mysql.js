const mysql = require("mysql");

const schema = "petmeeting";

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

function query(sql, option) {
  return new Promise((resolve, reject) => {
    if (option)
      MySQL.connection.query(sql, option, (err, rows) => {
        if (err) {
          console.log(err);
          reject();
        } else resolve(rows);
      });
    else
      MySQL.connection.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
          reject();
        } else resolve(rows);
      });
  });
}

module.exports = {
  createConnection: MySQL.createConnection,
  connection: MySQL.connection,
  query: query,

  list: (table, limit, offset) =>
    query(`SELECT * FROM ${schema}.${table} LIMIT ${limit} OFFSET ${offset}`),

  get: (table, id_name, id) =>
    query(`SELECT * FROM ${schema}.${table} WHERE ${id_name}='${id}'`).then(
      (rows) => {
        if (rows[0]) return rows[0];
        else throw "No Record";
      }
    ),

  write: (table, option) =>
    query(`INSERT INTO ${schema}.${table} SET ?`, option).then(
      (rows) => rows.insertId
    ),

  writeAll: (table, options) => {
    Promise.all(
      options.map((option) =>
        query(`INSERT INTO ${schema}.${table} SET ?`, option)
      )
    ).then((values) => true);
  },

  update: (table, option, id_name, id) =>
    query(
      `UPDATE ${schema}.${table} SET ? WHERE ${id_name}='${id}'`,
      option
    ).then((rows) => true),

  updateAll: (table, options, id_name, id) => {
    Promise.all(
      options.map((option) =>
        query(
          `UPDATE ${schema}.${table} SET ? WHERE ${id_name}='${id}'`,
          option
        )
      )
    ).then((values) => true);
  },

  delete: (table, id_name, id) =>
    query(`DELETE FROM ${schema}.${table} WHERE ${id_name}='${id}'`).then(
      (rows) => true
    ),
};
