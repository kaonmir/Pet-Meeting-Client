const Model = require("./model");

class Option extends Model {
  constructor(conn) {
    super("", "", conn);
  }

  async listHousing() {
    const sql = `SELECT * FROM Housing`;
    return await super.query(sql);
  }

  async listCity() {
    const sql = `SELECT * FROM City`;
    return await super.query(sql);
  }

  async listBreed() {
    const sql = `SELECT * FROM Breed`;
    return await super.query(sql);
  }

  async listSpecies() {
    const sql = `SELECT * FROM Species`;
    return await super.query(sql);
  }

  async listGender() {
    const sql = `SELECT * FROM Gender`;
    return await super.query(sql);
  }
}

module.exports = Option;
