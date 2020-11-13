"use strict";

var express = require("express");

var router = express.Router();

var multer = require("multer");

var _require = require("express-validator"),
    body = _require.body,
    param = _require.param,
    query = _require.query,
    validationResult = _require.validationResult;

var _require2 = require("../services/format"),
    formatTime = _require2.formatTime; // GET /showoff (list)


router.get("/", [query("limit").isNumeric().notEmpty(), query("offset").isNumeric().notEmpty()], function _callee(req, res, next) {
  var _req$query, offset, limit, _ref, error, result;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (validationResult(req).isEmpty()) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next(new Error("Parameter Error")));

        case 2:
          _req$query = req.query, offset = _req$query.offset, limit = _req$query.limit;
          _context.next = 5;
          return regeneratorRuntime.awrap(req.container.showoffService.list(offset, limit));

        case 5:
          _ref = _context.sent;
          error = _ref.error;
          result = _ref.result;
          if (error) next(new Error(error));else res.json({
            result: result
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}); // GET /showoff/:sid

router.get("/:sid(\\d+)", [param("sid").isNumeric()], function _callee2(req, res, next) {
  var sid, _ref2, error, result;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (validationResult(req).isEmpty()) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", next(new Error("Parameter Error")));

        case 2:
          sid = req.params.sid;
          _context2.next = 5;
          return regeneratorRuntime.awrap(req.container.showoffService.get(sid));

        case 5:
          _ref2 = _context2.sent;
          error = _ref2.error;
          result = _ref2.result;
          if (error) next(new Error(error));else res.json({
            result: result
          });

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // GET /showoff/best

router.get("/best", function _callee3(req, res, next) {
  var _ref3, error, result;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (validationResult(req).isEmpty()) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt("return", next(new Error("Parameter Error")));

        case 2:
          _context3.next = 4;
          return regeneratorRuntime.awrap(req.container.showoffService.best());

        case 4:
          _ref3 = _context3.sent;
          error = _ref3.error;
          result = _ref3.result;
          if (error) next(new Error(error));else res.json({
            result: result
          });

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // POST /showoff

router.post("/", [body("text").isString().notEmpty()], function _callee4(req, res, next) {
  var text, uid, date, file, _ref4, error, result;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(!validationResult(req).isEmpty() || !req.file)) {
            _context4.next = 5;
            break;
          }

          if (!req.file) {
            _context4.next = 4;
            break;
          }

          _context4.next = 4;
          return regeneratorRuntime.awrap(req.container.imageService.removeFile(req.file.filename));

        case 4:
          return _context4.abrupt("return", next(new Error("Parameter Error")));

        case 5:
          text = req.body.text; //  const uid = req.session;

          uid = 1;
          date = formatTime(new Date());
          file = req.file;
          _context4.next = 11;
          return regeneratorRuntime.awrap(req.container.showoffService.post({
            text: text,
            uid: uid,
            date: date,
            file: file
          }));

        case 11:
          _ref4 = _context4.sent;
          error = _ref4.error;
          result = _ref4.result;
          if (error) next(new Error(error));else res.json({
            result: result
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // PUT /showoff/:sid

router.put("/:sid", [param("sid").isNumeric(), body("text").isString().optional({
  checkFalsy: true
})], function _callee5(req, res, next) {
  var uid, sid, text, date, file, _ref5, e, showoff, _ref6, error, result;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (validationResult(req).isEmpty()) {
            _context5.next = 5;
            break;
          }

          if (!req.file) {
            _context5.next = 4;
            break;
          }

          _context5.next = 4;
          return regeneratorRuntime.awrap(req.container.imageService.removeFile(req.file.filename));

        case 4:
          return _context5.abrupt("return", next(new Error("Parameter Error")));

        case 5:
          uid = req.uid;
          sid = req.params.sid;
          text = req.body.text;
          date = formatTime(new Date());
          file = req.file;
          _context5.next = 12;
          return regeneratorRuntime.awrap(req.container.showoffService.get(sid));

        case 12:
          _ref5 = _context5.sent;
          e = _ref5.error;
          showoff = _ref5.result;

          if (!e) {
            _context5.next = 19;
            break;
          }

          next(new Error(e));
          _context5.next = 29;
          break;

        case 19:
          if (!(showoff.UID != uid)) {
            _context5.next = 23;
            break;
          }

          next(new Error("Authentication Error"));
          _context5.next = 29;
          break;

        case 23:
          _context5.next = 25;
          return regeneratorRuntime.awrap(req.container.showoffService.update(sid, {
            text: text,
            date: date,
            file: file
          }));

        case 25:
          _ref6 = _context5.sent;
          error = _ref6.error;
          result = _ref6.result;
          if (error) next(new Error(error));else res.json({
            result: result
          });

        case 29:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // DELETE /showoff/:sid

router["delete"]("/:sid", [param("sid").isNumeric()], function _callee6(req, res, next) {
  var uid, sid, _ref7, e1, showoff, _ref8, error, result;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (validationResult(req).isEmpty()) {
            _context6.next = 2;
            break;
          }

          return _context6.abrupt("return", next(new Error("Parameter Error")));

        case 2:
          //  const uid = req.session;
          uid = 1;
          sid = req.params.sid;
          _context6.next = 6;
          return regeneratorRuntime.awrap(req.container.showoffService.get(sid));

        case 6:
          _ref7 = _context6.sent;
          e1 = _ref7.error;
          showoff = _ref7.result;

          if (!e1) {
            _context6.next = 13;
            break;
          }

          next(new Error("Already Deleted!"));
          _context6.next = 23;
          break;

        case 13:
          if (!(showoff.UID != uid)) {
            _context6.next = 17;
            break;
          }

          next(new Error("Authentication Error"));
          _context6.next = 23;
          break;

        case 17:
          _context6.next = 19;
          return regeneratorRuntime.awrap(req.container.showoffService["delete"](sid));

        case 19:
          _ref8 = _context6.sent;
          error = _ref8.error;
          result = _ref8.result;
          if (error) next(new Error(error));else res.json({
            result: result
          });

        case 23:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // ---------------- Vote ------------------------ //
// GET /showoff/vote/:sid

router.get("/voted/:sid", [param("sid").isNumeric()], function _callee7(req, res, next) {
  var uid, sid, _ref9, error, result;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          if (validationResult(req).isEmpty()) {
            _context7.next = 2;
            break;
          }

          return _context7.abrupt("return", next(new Error("Parameter Error")));

        case 2:
          uid = req.uid;
          sid = req.params.sid;
          _context7.next = 6;
          return regeneratorRuntime.awrap(req.container.showoffService.get_vote(uid, sid));

        case 6:
          _ref9 = _context7.sent;
          error = _ref9.error;
          result = _ref9.result;

          if (!error) {
            _context7.next = 13;
            break;
          }

          return _context7.abrupt("return", next(new Error(error)));

        case 13:
          res.json({
            result: result
          });

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  });
}); // GET /showoff/vote/:sid

router.post("/vote/:sid", [param("sid").isNumeric(), body("score").isNumeric()], function _callee8(req, res, next) {
  var uid, sid, _ref10, error, result;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          if (validationResult(req).isEmpty()) {
            _context8.next = 2;
            break;
          }

          return _context8.abrupt("return", next(new Error("Parameter Error")));

        case 2:
          uid = req.uid;
          sid = req.params.sid;
          _context8.next = 6;
          return regeneratorRuntime.awrap(req.container.showoffService.vote(uid, sid));

        case 6:
          _ref10 = _context8.sent;
          error = _ref10.error;
          result = _ref10.result;

          if (!error) {
            _context8.next = 13;
            break;
          }

          return _context8.abrupt("return", next(new Error(error)));

        case 13:
          res.json({
            result: result
          });

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  });
});
module.exports = router;