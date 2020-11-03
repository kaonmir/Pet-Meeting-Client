const Schema = require("validate");

const schema = new Schema({
  Motivation: {
    type: String,
    required: true,
  },
  CarrierPeriod: {
    type: Boolean,
    required: true,
  },
  Eid: {
    type: Number,
    required: true,
  },
  CityID: {
    type: Number,
    required: true,
  },
});

module.exports = schema;
