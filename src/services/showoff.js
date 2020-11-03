const fs = require("fs");

class ShowoffService {
  constructor(showoffModel, imageModel) {
    this.showoffModel = showoffModel;
    this.imageModel = imageModel;
  }

  list = async (offset, limit) => await this.showoffModel.list(offset, limit);
  get = async (sid) => await this.showoffModel.findById(sid);
  delete = async (sid) => await this.showoffModel.delete(sid);

  async post(DTO) {
    if (DTO.file) {
      const { result: imgId } = await this.imageModel.create(DTO.file);
      DTO.imgId = imgId;
    } else DTO.imgId = 1; // default image
    delete DTO.file;

    return await this.showoffModel.create(DTO);
  }

  async update(sid, DTO) {
    const { error, result: showoff } = await this.showoffModel.findById(sid);

    if (error) return { error };

    if (DTO.file) {
      const { error, result } = await this.imageModel.update(
        showoff.ImgID,
        DTO.file
      );
      if (!error) DTO.imgId = result;
    }
    delete DTO.file;

    return await this.showoffModel.update(sid, DTO);
  }

  // ---------------- Vote ------------------------ //

  isvoted = async (uid, sid) => {
    const { error } = await this.showoffModel.findById(sid);
    if (error) return { error };
    else return await this.showoffModel.isvoted(uid, sid);
  };

  async vote(uid, sid) {
    const { error, result: isvoted } = await this.isvoted(uid, sid);
    if (error) return { error };

    if (!isvoted) return await this.showoffModel.upvote(uid, sid);
    else return await this.showoffModel.downvote(uid, sid);
  }
}

module.exports = ShowoffService;
