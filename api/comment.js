const MySQL = require("./mysql");

module.exports = {
  list: (wid, limit, offset) => {
    const sql = `SELECT * FROM petmeeting.CommentView WHERE WID='${wid}' 
                  LIMIT ${limit} OFFSET ${offset}`;
    return MySQL.query(sql);
  },
};
