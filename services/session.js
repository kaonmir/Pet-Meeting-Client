const session = require("express-session");

module.exports = {
  getUID: (req) => {
    return 1;
    // return req.session.uid;
  },
};
