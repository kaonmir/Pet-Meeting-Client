const MySQL = require("./mysql");

module.exports = {
  // TODO Crypto of password
  login: (username, password) => {
    const sql = `SELECT * FROM User WHERE username="${username}" AND password="${password}"`;
    return MySQL.query(sql).then((result) => {
      if (result[0]) return result[0].UID;
      else throw "Error: There's no user";
    });
  },
};
