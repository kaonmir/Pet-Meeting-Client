const fs = require("fs");

class ShowoffService {
  constructor(worryModel, commentModel) {
    this.worryModel = worryModel;
    this.commentModel = commentModel;
  }

  list = async (offset, limit) => await this.worryModel.list(offset, limit);
  get = async (wid) => await this.worryModel.findById(wid);
  create = async (DTO) => await this.worryModel.create(DTO);
  update = async (wid, DTO) => await this.worryModel.update(wid, DTO);
  delete = async (wid) => await this.worryModel.delete(wid);

  // ---------------- Comments ------------------------ //

  listComment = async (wid, offset, limit) =>
    await this.commentModel.list(wid, offset, limit);
  getComment = async (cid) => await this.commentModel.findById(cid);
  createComment = async (DTO) => await this.commentModel.create(DTO);
  updateComment = async (cid, DTO) => await this.commentModel.update(cid, DTO);
  deleteComment = async (cid) => await this.commentModel.delete(cid);

  // ---------------- Bookmark ------------------------ //

  isBookmarked = async (uid, wid) =>
    await this.worryModel.isBookmarked(uid, wid);

  async bookmark(uid, wid) {
    const { error, result: isBookmarked } = await this.isBookmarked(uid, wid);
    if (error) return next(new Error(error));

    if (!isBookmarked) return await this.worryModel.bookmark(uid, wid);
    else return await this.worryModel.unbookmark(uid, wid);
  }
}

module.exports = ShowoffService;
