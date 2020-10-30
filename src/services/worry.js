const fs = require("fs");

class ShowoffService {
  constructor(worryModel) {
    this.worryModel = worryModel;
  }

  list = async (offset, limit) => await this.worryModel.list(offset, limit);
  get = async (wid) => await this.worryModel.findById(wid);
  create = async (DTO) => await this.worryModel.create(DTO);
  update = async (wid, DTO) => await this.worryModel.update(wid, DTO);
  delete = async (wid) => await this.worryModel.delete(wid);

  // ---------------- Bookmark ------------------------ //

  isBookmarked = async (uid, wid) =>
    await this.worryModel.isBookmarked(uid, wid);

  async bookmark(uid, wid) {
    const { error, result: isBookmarked } = await this.isBookmarked(uid, sid);
    if (error) return next(new Error(error));

    if (!isBookmarked) return await this.worryModel.bookmark(uid, wid);
    else return await this.worryModel.unbookmark(uid, wid);
  }
}

module.exports = ShowoffService;
