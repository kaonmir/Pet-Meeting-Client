const Schema = require("validate");

const schema = new Schema({
  text: {
    type: String,
    required: true,
  },
});

module.exports = schema;
