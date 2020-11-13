const Model = require("./model");

class Showoff extends Model {
  constructor(conn) {
    super("sid", "Showoff", conn);
  }

  async best(thresholdDate) {
    const sql = `SELECT * FROM petmeeting.ShowoffView
                  WHERE Date > date_format("${thresholdDate}", "%Y-%m-%d")
                  ORDER BY Votes DESC
                  LIMIT 1`;
    const { error, result } = await this.query(sql);

    if (error) return { error };
    else if (result.length == 0) return { error: "No Record!" };
    else return { result: result[0] };
  }

  // ---------------- Vote ------------------------ //
  async get_vote(uid, sid) {
    const sql = `SELECT * FROM petmeeting.Vote WHERE UID=${uid} AND SID=${sid}`;
    const { error, result } = await this.query(sql);
    if (error) return { error };
    else if (result.length == 0) return { error: "You didn't vote" };
    else return { result: result[0].Score };
  }
  async set_vote(uid, sid, score) {
    const sql = `REPLACE INTO petmeeting.Vote SET ?`;
    const { error } = await this.query(sql, { uid, sid, score });
    return { error, result: true };
  }
}
/*
async list(offset, limit)
async findById(name, id) 
async create(DTO) 
async update(name, id, DTO) 
async delete(name, id) 
*/

module.exports = Showoff;
