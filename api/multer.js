const multer = require("multer");
const path = require("path");
const fs = require("fs");
const MySQL = require("./mysql");

function fileFilter(req, file, callback) {
  var ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
    return callback(res.end("Only images are allowed"), null);
  }
  callback(null, true);
}

module.exports = {
  single: (fieldname) =>
    multer({
      dest: "./images/",
      fileFilter: fileFilter,
      limit: { fileSize: 5 * 1024 * 1024 },
    }).single(fieldname),

  upload: (file) => {
    const { filename, mimetype, originalname, size } = file;
    const option = {
      Filename: filename,
      MimeType: mimetype,
      OriginalName: originalname,
      Size: size,
    };
    const sql = `INSERT INTO petmeeting.Image SET ?`;

    return MySQL.write("Image", option);
  },

  // Return fs ReadStream
  download: (filename) => {
    const filePath = "./images/" + filename;
    // res.setHeader("Content-Type","binary/octet-stream");
    // res.setHeader("Content-Disposition", "attachment;filename=" + encodeURI(originalname));
    var fileStream = fs.createReadStream(filePath);
    // fileStream.pipe(res);

    return fileStream;
  },

  delete: (filename) =>
    new Promise((resolve, reject) => {
      const filePath = "./images/" + filename;
      fs.unlink(filePath, () => {
        const sql = `DELETE FROM petmeeting.Image WHERE Filename='${filename}'`;
        MySQL.query(sql, (err, rows) => {
          if (err) reject(err);
          else resolve(true);
        });
      });
    }),
};
