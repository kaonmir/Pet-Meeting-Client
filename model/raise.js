const Schema = require("validate");

const schema = new Schema({
  motivation: {
    type: String,
    required: true,
  },
  CarrierPeriod: {
    type: Boolean,
    required: true,
  },
  eid: {
    type: Number,
    required: true,
  },
  cityID: {
    type: Number,
    required: true,
  },
});

module.exports = schema;
