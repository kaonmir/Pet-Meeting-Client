const crud = require("./mysql");

const table = "pet";
const id_name = "pid";

module.exports = {
  /* --------------------- Entrust ---------------------*/

  // 아직 동작 확인 못함
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
