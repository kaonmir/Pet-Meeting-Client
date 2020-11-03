const Model = require("./model");

class Image extends Model {
  constructor(conn) {
    super("imgId", "Image", conn);
  }

  async create(file) {
    const { filename, mimetype, originalname, size } = file;
    var file = { filename, mimetype, originalname, size };
    return super.create(file);
  }

  async update(imgId, file) {
    const { filename, mimetype, originalname, size } = file;
    var file = { filename, mimetype, originalname, size };

    const { error, result } = await super.findById(imgId);
    if (error) return { error };

    // Remove original file from server and change metadata in DB
    this.removeFile(result.Fieldname);
    return await super.update(imgId, file);
  }

  async delete(imgId) {
    const { error, result: img } = await super.findById(imgId);
    if (error) return { error };

    super.delete(imgId);
    this.removeFile(img.Filename);
  }

  async removeFile(filename) {
    // TODO
    return {};
  }
}

/*
async list(offset, limit)
async findById(id) 
async create(DTO) 
async update(id, DTO) 
async delete(id) 
*/

module.exports = Image;
