const Model = require("./model");

class Raise extends Model {
  constructor(conn) {
    super("rid", "Raise", conn);
  }
}

module.exports = Raise;
