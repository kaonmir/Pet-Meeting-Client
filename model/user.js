const Schema = require("validate");

const user = new Schema({
  username: {
    type: String,
    required: true,
    length: { min: 3, max: 32 },
  },
  password: {
    type: String,
    required: true,
    // TODO
  },
  email: {
    type: String,
    match: /^\w+@\w+\.\D+$/,
  },
  phone: {
    type: String,
    match: /^(\d{2,3}-\d{3,4}-\d{3,4}|\d{8,})$/,
  },
});

module.exports = {
  user: user,
};
