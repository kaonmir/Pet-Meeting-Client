const { formatTime } = require("./format");

class RaiseService {
  constructor(raiseModel, entrustModel, chatModel) {
    this.raiseModel = raiseModel;
    this.entrustModel = entrustModel;
    this.chatModel = chatModel;
  }

  get = async (rid) => await this.raiseModel.findById(rid);
  delete = async (rid) => await this.raiseModel.delete(rid);
  update = async (rid, DTO) => await this.raiseModel.update(rid, DTO);

  async create(DTO) {
    const { error: e1, result: rid } = await this.raiseModel.create(DTO);
    const { error: e2, result: entrust } = await this.entrustModel.findById(
      DTO.eid
    );
    if (e1 || e2) return { error: e1 || e2 };

    // 채팅에 등록
    const { error } = await this.chatModel.chat(
      await this.chatModel.getChatID(DTO.uid, entrust.UID),
      DTO.uid,
      formatTime(new Date()),
      "User wants to raise your pet"
    );
    return { error, result: rid };
  }
}

module.exports = RaiseService;
