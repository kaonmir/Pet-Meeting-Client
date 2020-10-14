const MySQL = require("./mysql");

module.exports = {
  best: () => {
    // Later, 저거 명령문 해킹 방지하기

    const _m = new Date();
    const month = _m.getMonth() != 0 ? _m.getMonth() : 12; // 한 달 빼주기
    const date = `${_m.getFullYear()}-${month}-${_m.getDate()}`;

    const sql = `SELECT * FROM petmeeting.ShowoffView
                    WHERE Date > str_to_date('${date}', '%Y-%m-%d')
                    ORDER BY Votes DESC LIMIT 1;`;
    return MySQL.query(sql).then((rows) => rows[0]);
  },
  /* --------------------- Vote ---------------------*/

  vote: (sid, uid) => {
    const sql = `INSERT INTO petmeeting.Vote SET UID='${uid}', SID='${sid}'`;
    return MySQL.query(sql);
  },
  unvote: (sid, uid) => {
    const sql = `DELETE FROM petmeeting.Vote WHERE UID='${uid}' AND SID='${sid}'`;
    return MySQL.query(sql);
  },
  voted: (sid, uid) => {
    const sql = `SELECT * FROM petmeeting.Vote WHERE UID='${uid}' AND SID='${sid}'`;
    return MySQL.query(sql).then((rows) => rows.length == 1);
  },
};
