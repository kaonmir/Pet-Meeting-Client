const Model = require("./model");

class Option extends Model {
  constructor(conn) {
    super("", "", conn);
  }

  async EIDHousing(eid) {
    const sql = `SELECT HousingID FROM Housings WHERE EID=${eid}`;
    const { error, result: rows } = await this.query(sql);

    if (error) return { error };
    return { result: rows.map((row) => row.HousingID) };
  }

  async listHousing() {
    const sql = `SELECT * FROM Housing`;
    return await this.query(sql);
  }

  async listCity() {
    const sql = `SELECT * FROM City`;
    return await this.query(sql);
  }

  async listBreed() {
    const sql = `SELECT * FROM Breed`;
    return await this.query(sql);
  }

  async listSpecies() {
    const sql = `SELECT * FROM Species`;
    return await this.query(sql);
  }

  async listGender() {
    const sql = `SELECT * FROM Gender`;
    return await super.query(sql);
  }
}

module.exports = Option;
