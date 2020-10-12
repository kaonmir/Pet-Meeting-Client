const MySQL = require("./mysql");

module.exports = {
  list: (limit, offset) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM petmeeting.Entrust_Application LIMIT ${limit} OFFSET ${offset}`;
      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  get: (pid) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM petmeeting.Entrust_Application WHERE EID='${pid}'`;
      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    }),

  write: (
    text,
    start_date,
    end_date,
    preypayment,
    toypayment,
    cityID,
    created_date,
    uid
  ) =>
    new Promise((resolve, reject) => {
      const option = {
        Text: text,
        StartDate: start_date,
        EndDate: end_date,
        Preypayment: preypayment,
        Toypayment: toypayment,
        CityID: cityID,
        CreatedDate: created_date,
        UID: uid,
      };
      const sql = `INSERT INTO petmeeting.Entrust_Application SET ?`;
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

  // ----------------------------------------------- //

  addHousing: (eid, housingID) =>
    new Promise((resolve, reject) => {
      const sql = `INSERT INTO petmeeting.Housings VALUES('${eid}', '${housingID}')`;

      MySQL.get().query(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),
};
