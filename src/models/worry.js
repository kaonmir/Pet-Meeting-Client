const Model = require("./model");

class Worry extends Model {
  constructor(conn) {
    super("wid", "Worry", conn);
  }

  // ---------------- Bookmark ------------------------ //

  async bookmark(wid, uid) {
    const sql = `INSERT INTO petmeeting.BookMarkTo SET UID='${uid}', WID='${wid}'`;
    return await super.query(sql);
  }
  async unbookmark(wid, uid) {
    const sql = `DELETE FROM petmeeting.BookMarkTo WHERE UID='${uid}' AND WID='${wid}'`;
    return await super.query(sql);
  }
  async isBookmarked(wid, uid) {
    const sql = `SELECT * FROM petmeeting.BookMarkTo WHERE UID='${uid}' AND WID='${wid}'`;
    return await super.query(sql);
  }
}

module.exports = Worry;
