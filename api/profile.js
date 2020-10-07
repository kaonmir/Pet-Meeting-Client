const MySQL = require("./mysql");

function profile_user(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT Username, ImgUrl FROM User WHERE UID="${id}"`;
    MySQL.get().query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows[0]); // 하나의 유저만 요청하는 거니까 rows[0]
    });
  });
}
function profile_pets(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT Name, Year, Gender, ImgUrl FROM Pet WHERE UID="${id}"`;
    MySQL.get().query(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Give with chatID!!
function profile_chats(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT UID1, UID2 FROM ChatWith WHERE UID1="${id}" OR UID2="${id}"`;
    MySQL.get().query(sql, (err, rows) => {
      if (err) reject(err);
      else {
        var result = [];
        var promises = [];

        rows.forEach((row) => {
          const uid = row.UID1 === id ? row.UID2 : row.UID1;
          promises.push(profile_user(uid));

          // 나중에 redis에서 가장 최근 대화를 뽑아서 넣는다!!
          result.push({ Text: "blabla" });
        });

        Promise.all(promises).then((values) => {
          for (var i = 0; i < values.length; i++) {
            result[i].Name = values[i].Username;
            result[i].ImgUrl = values[i].ImgUrl;
          }
          resolve(result);
        });
      }
    });
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
