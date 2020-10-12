const Schema = require("validate");

const entrust = new Schema({
  text: {
    type: String,
    required: true,
  },
  start_date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
  },
  end_date: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
  },
  preypayment: {
    type: Boolean,
    required: true,
  },
  toypayment: {
    type: Number,
    required: true,
  },
  cityID: {
    type: Number,
    required: true,
  },
});

module.exports = {
  entrust: entrust,
};
