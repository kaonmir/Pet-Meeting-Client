const Model = require("./model");

class Showoff extends Model {
  constructor(conn) {
    super("sid", "Showoff", conn);
  }

  // ---------------- Vote ------------------------ //
  async isvoted(uid, sid) {
    const sql = `SELECT * FROM petmeeting.Vote WHERE UID=${uid} AND SID=${sid}`;
    const { error, result } = await super.query(sql);
    if (error) return { error };
    else return { result: result.length === 1 };
  }
  async upvote(uid, sid) {
    const sql = `INSERT INTO petmeeting.Vote SET UID=${uid}, SID=${sid}`;
    const { error } = await super.query(sql);
    if (error) return { error };
    else return { result: true };
  }
  async downvote(uid, sid) {
    const sql = `DELETE FROM petmeeting.Vote WHERE UID=${uid} AND SID=${sid}`;
    const { error } = await super.query(sql);
    if (error) return { error };
    else return { result: false };
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
