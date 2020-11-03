const Model = require("./model");

class Comment extends Model {
  constructor(conn) {
    super("cid", "Comment", conn);
  }

  list = async (wid, offset, limit) =>
    await super.list(offset, limit, "wid", wid);
}

module.exports = Comment;
