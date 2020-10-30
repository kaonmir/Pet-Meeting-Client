const Model = require("./model");

class Entrust extends Model {
  constructor(conn) {
    super("eid", "Entrsut", conn);
  }

  async listEntrsutablePets(limit, offset) {
    const sql = `SELECT * FROM PetView WHERE !isnull(EID) LIMIT ${limit} OFFSET ${offset}`;
    return await super.query(sql);
  }
}

module.exports = Entrust;
