const MySQL = require("./mysql");

module.exports = {
  bookmark: (wid, uid) => {
    const sql = `INSERT INTO petmeeting.BookMarkTo SET UID='${uid}', WID='${wid}'`;
    return MySQL.query(sql).then(() => {
      return { bookmarked: true };
    });
  },
  unbookmark: (wid, uid) => {
    const sql = `DELETE FROM petmeeting.BookMarkTo WHERE UID='${uid}' AND WID='${wid}'`;
    return MySQL.query(sql).then(() => {
      return { bookmarked: false };
    });
  },
  bookmarked: (wid, uid) => {
    const sql = `SELECT * FROM petmeeting.BookMarkTo WHERE UID='${uid}' AND WID='${wid}'`;
    return MySQL.query(sql).then((rows) => rows.length == 1);
  },
};
