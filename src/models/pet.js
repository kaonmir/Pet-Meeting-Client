const Model = require("./model");

class Pet extends Model {
  constructor(conn) {
    super("pid", "Pet", conn);
  }
}

/*
async list(offset, limit)
async findById(name, id) 
async create(DTO) 
async update(name, id, DTO) 
async delete(name, id) 
*/

module.exports = Pet;
