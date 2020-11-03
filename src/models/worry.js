const Model = require("./model");

class Worry extends Model {
  constructor(conn) {
    super("wid", "Worry", conn);
  }

  // ---------------- Bookmark ------------------------ //

  async bookmark(uid, wid) {
    const sql = `INSERT INTO petmeeting.BookMarkTo SET UID='${uid}', WID='${wid}'`;
    const { error } = await super.query(sql);
    return { error, result: true };
  }
  async unbookmark(uid, wid) {
    const sql = `DELETE FROM petmeeting.BookMarkTo WHERE UID='${uid}' AND WID='${wid}'`;
    const { error } = await super.query(sql);
    return { error, result: false };
  }
  async isBookmarked(uid, wid) {
    const sql = `SELECT * FROM petmeeting.BookMarkTo WHERE UID='${uid}' AND WID='${wid}'`;
    const { error, result } = await super.query(sql);
    return { error, result: result.length == 1 };
  }
}

module.exports = Worry;
