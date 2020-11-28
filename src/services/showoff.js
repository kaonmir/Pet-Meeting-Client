class ShowoffService {
  constructor(recommenderModel, showoffModel, imageModel) {
    this.recommenderModel = recommenderModel;
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

  async best() {
    var date = new Date();
    date.setMonth(date.getMonth() - 4);
    return await this.showoffModel.best(
      `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    );
  }

  // ---------------- Vote ------------------------ //

  get_vote = async (uid, sid) => {
    const { error } = await this.showoffModel.findById(sid);
    if (error) return { error };
    else return await this.showoffModel.get_vote(uid, sid);
  };

  set_vote = async (uid, sid, score) => {
    const { error } = await this.showoffModel.findById(sid);
    if (error) return { error };
    else {
      this.recommenderModel.voteEvent();
      return await this.showoffModel.set_vote(uid, sid, score);
    }
  };
}

module.exports = ShowoffService;
