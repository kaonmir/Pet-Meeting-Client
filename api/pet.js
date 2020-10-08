const MySQL = require("./mysql");

module.exports = {
  list: (limit, offset) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM petmeeting.PetView LIMIT ${limit} OFFSET ${offset}`;
      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  get: (pid) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM petmeeting.PetView WHERE PID='${pid}'`;
      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    }),

  write: (name, year, genderID, description, breedID, uid, imgID) =>
    new Promise((resolve, reject) => {
      const option = {
        Name: name,
        Year: year,
        GenderID: genderID,
        GradeRatio: 0,
        Description: description,
        BreedID: breedID,
        UID: uid,
        ImgID: imgID,
      };
      const sql = `INSERT INTO petmeeting.Pet SET ?`;
      MySQL.get().query(sql, option, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  update: (pid, name, year, genderID, description, breedID, imgID) =>
    new Promise((resolve, reject) => {
      const option = {
        Name: name,
        Year: year,
        GenderID: genderID,
        Description: description,
        BreedID: breedID,
        ImgID: imgID,
      };
      const sql = `UPDATE petmeeting.Pet SET ? WHERE PID='${pid}'`;
      MySQL.get().query(sql, option, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  delete: (pid) =>
    new Promise((resolve, reject) => {
      const sql = `DELETE FROM petmeeting.Pet WHERE PID='${pid}'`;

      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  /* --------------------- Entrust ---------------------*/

  entrust: (eid, pids) =>
    Promise.all(
      pids.map(
        (pid) =>
          new Promise((resolve, reject) => {
            const sql = `UPDATE petmeeting.Pet SET EID='${eid}' WHERE PID='${pid}'`;

            MySQL.get().query(sql, (err, rows) => {
              if (err) reject(err);
              else resolve(rows);
            });
          })
      )
    ),
};
