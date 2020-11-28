const fetch = require("node-fetch");
const { RecommenderOption } = require("../../config.json");

class Recommender {
  constructor() {
    const { host, port } = RecommenderOption;
    this.BASE_URL = `http://${host}:${port}`;
  }
  // 파이썬에서 pets를 받아온다.
  // url: /choosing_page?uid=#
  async listPets(uid) {
    var error = null;
    var res;
    try {
      res = await fetch(`${this.BASE_URL}/choosing_page?uid=${uid}`);
    } catch (e) {
      error = e;
    }
    const { result } = await res.json();

    return { error, result };
  }

  async voteEvent() {
    try {
      console.log("vote");
      fetch(`${this.BASE_URL}/show_off_page?vote=1`);
    } catch (e) {}
  }
}

module.exports = Recommender;
