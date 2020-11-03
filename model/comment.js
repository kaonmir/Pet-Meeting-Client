const Schema = require("validate");

const comment = new Schema({
  text: {
    type: String,
    required: true,
  },
  cid_replyto: {
    type: Number,
  },
  wid: {
    type: Number,
    required: true,
  },
});

module.exports = comment;
