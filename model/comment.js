const Schema = require("validate");

const comment = new Schema({
  Text: {
    type: String,
    required: true,
  },
  CID_ReplyTo: {
    type: Number,
  },
  WID: {
    type: Number,
    required: true,
  },
});

module.exports = comment;
