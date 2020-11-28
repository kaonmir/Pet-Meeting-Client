const Model = require("./model");

class Entrust extends Model {
  constructor(conn) {
    super("eid", "Entrust", conn);
  }

  // pids를 가지고 pets를 만든다.
  async listEntrustablePets(pids) {
    if (pids.length == 0) return { result: [] };
    // const sql = `SELECT * FROM PetView WHERE !isnull(EID) AND UID != ${uid} LIMIT ${limit} OFFSET ${offset}`;
    const pid_option = pids.map((pid) => `PID = ${pid}`).join(" OR ");
    const sql = `SELECT * FROM petmeeting.PetView WHERE ${pid_option};`;

    return await super.query(sql);
  }

  async listHousings(eid) {
    const sql = `SELECT * FROM Housings WHERE EID=${eid}`;
    return await super.query(sql);
  }

  async validHousingArray(housings) {
    let error;
    let result = true;

    const sql = `SELECT * FROM Housing WHERE HousingID=`;
    await housings.forEach(async (housing) => {
      const { error: e1, result: rows } = await super.query(sql + housing);
      if (e1) error = e1;
      else if (rows.length != 1) result = false;
    });

    if (error) return { error };
    else return { result };
  }

  async createHousingsAll(eid, housings) {
    let error;

    const sql = `INSERT INTO Housings SET EID=${eid}, HousingID=`;
    await housings.forEach(async (housing) => {
      const { error: e1, result: rows } = this.query(sql + housing);
      if (e1) error = e1;
    });

    if (error) return { error };
    else return { result: true };
  }

  async updateHousingsAll(eid, housings) {
    const { error: e1 } = await this.deleteHousingsAll(eid);
    const { error: e2 } = await this.createHousingsAll(eid, housings);
    return { error: e1 || e2 };
  }

  async deleteHousingsAll(eid) {
    const sql = `DELETE FROM Housings WHERE EID=${eid}`;
    return await this.query(sql);
  }
}

module.exports = Entrust;
