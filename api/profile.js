const MySQL = require("./mysql");
const chat = require("./chat");

function profile_user(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT Username, Filename FROM petmeeting.UserView WHERE UID="${id}"`;
    MySQL.get().query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows[0]); // 하나의 유저만 요청하는 거니까 rows[0]
    });
  });
}
function profile_pets(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT Name, Year, Gender, Filename FROM petmeeting.PetView WHERE UID="${id}"`;
    MySQL.get().query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function profile_chats(uid) {
  return new Promise((resolve, reject) => {
    chat
      .scan(uid)
      .then((result) => {
        const sql = `SELECT UID, Username, Filename FROM petmeeting.UserView
                  WHERE ${result.map((v) => ` UID='${v}' `).join(" OR ")}`;
        MySQL.get().query(sql, (err, rows) => {
          if (err) reject(err);
          else {
            var promises = rows.map((row) =>
              chat.list(chat.getChatID(uid, row.UID), -1, -1)
            );
            Promise.all(promises)
              .then((values) =>
                values.map((v, idx) => {
                  return {
                    ...rows[idx],
                    message: v[0].message,
                  };
                })
              )
              .then((result) => resolve(result))
              .catch((err) => reject(err));
          }
        });
      })
      .catch((err) => reject(err));
  });
}

function profile(id) {
  const promises = [profile_user(id), profile_pets(id), profile_chats(id)];
  return Promise.all(promises).then((values) => {
    return {
      // Pets의 경우 api와 DB의 프로필이미지 변수 이름이 다르다...
      user: values[0],
      pets: values[1],
      chats: values[2],
    };
  });
}

module.exports = {
  profile_user: profile_user,
  profile_pets: profile_pets,
  profile_chats: profile_chats,
  profile: profile,
};
