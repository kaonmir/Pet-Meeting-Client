class Model {
  constructor(id_name, table, conn) {
    this.name = id_name;
    this.table = table;
    this.conn = conn;
  }

  async query(sql, option) {
    var error, result;

    await new Promise((resolve, reject) => {
      if (option)
        this.conn.query(sql, option, (err, rows) => resolve(err, rows));
      else this.conn.query(sql, (err, rows) => resolve(err, rows));
    }).then((err, rows) => {
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
    const { error } = await this.findById(this.name, id);
    if (error) return false;
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
    else if (result.length == 0) return { error: "No User!" };
    else return { result: result[0] };
  }

  async create(DTO) {
    const sql = `INSERT INTO ${this.table} SET ?`;
    const { error, result } = await this.query(sql, DTO);

    if (error) return this.errorParser(error);
    else return { result: result.insertId };
  }

  async update(id, DTO) {
    const sql = `UPDATE ${this.table} SET ? WHERE ${this.name}='${id}'`;
    const { error, result } = await this.query(sql, DTO);
    if (error) return this.errorParser(error);
    else return { result: true };
  }

  async delete(id) {
    const sql = `DELETE FROM ${this.table} WHERE ${this.name}='${id}'`;
    const { error, result } = await this.query(sql);

    if (error) return this.errorParser(error);
    else return { result: true };
  }
}

module.exports = Model;
