const Model = require("./model");

class User extends Model {
  constructor(conn) {
    super("uid", "User", conn);
  }

  async findByUsernameAndPassword(username, password) {
    const sql = `SELECT * FROM User WHERE username="${username}" AND password="${password}"`;
    const { error, result } = await this.query(sql);

    if (error) 
      return this.errorParser(error);
    else if (result.length == 0) 
    return { error: "No User!" };
    else return { 
      uid: result[0].UID };
  }
}

/*
async list(offset, limit)
async findById(name, id) 
async create(DTO) 
async update(name, id, DTO) 
async delete(name, id) 
*/

module.exports = User;
