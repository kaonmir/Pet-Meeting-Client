class Model {
  constructor(id_name, table, conn) {
    this.name = id_name;
    this.table = table;
    this.conn = conn;
  }
//query의 기능은 알 필요 없음 
  async query(sql, option, nullable) {
    var error, result;

    await new Promise((resolve, reject) => {
      if (option) {
        if (!nullable)
          Object.keys(option).forEach((v) => {
            if (!option[v]) delete option[v];
          });
        this.conn.query(sql, option, (err, rows) => resolve({ err, rows }));
      } else this.conn.query(sql, (err, rows) => resolve({ err, rows }));
    }).then(({ err, rows }) => {
      error = err;
      result = rows;
    });

    return { error, result };
  }

  errorParser(error) {
    // TODO
    console.log(error);
    return { error: "Database Error" };
  }

  // ------------------------------------------------------------------

  async exist(id) {
    const { error, result } = await this.findById(this.name, id);
    console.log(id + " HMMMM " + result.PID);
    if (error || result == undefined) return false;
    else return true;
  }

  async list(offset, limit, name, id) {
    var sql = `SELECT * FROM ${this.table}View`;
    if (id) sql += ` WHERE ${name}=${id}`;
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const { error, result } = await this.query(sql);

    if (error) return this.errorParser(error);
    else return { result };
  }

  async findById(id) {
    const sql = `SELECT * FROM ${this.table}View WHERE ${this.name}=${id}`;
    const { error, result } = await this.query(sql);

    if (error) return this.errorParser(error);
    else if (result.length == 0) return { error: "No Record!" };
    else return { result: result[0] };
  }

  async create(DTO, nullable) {
    const sql = `INSERT INTO ${this.table} SET ?`;
    const { error, result } = await this.query(sql, DTO, nullable);

    if (error) return this.errorParser(error);
    else return { result: result.insertId };
  }

  async update(id, DTO, nullable) {
    const sql = `UPDATE ${this.table} SET ? WHERE ${this.name}='${id}'`;
    const { error } = await this.query(sql, DTO, nullable);
    if (error) return this.errorParser(error);
    else return { result: true };
  }

  async delete(id) {
    const sql = `DELETE FROM ${this.table} WHERE ${this.name}='${id}'`;
    const { error } = await this.query(sql);

    if (error) return this.errorParser(error);
    else return { result: true };
  }
}

module.exports = Model;
