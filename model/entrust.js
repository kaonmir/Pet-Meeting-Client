const Schema = require("validate");

const schema = new Schema({
  Text: {
    type: String,
    required: true,
  },
  StartDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
  },
  EndDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
  },
  Preypayment: {
    type: Boolean,
    required: true,
  },
  Toypayment: {
    type: Number,
    required: true,
  },
  CityID: {
    type: Number,
    required: true,
  },
  HousingIDs: {
    required: true,
  },
});

module.exports = schema;
