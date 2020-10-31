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

  // Create하면 채팅에 등록되도록
  async create(DTO) {
    const { error: e1, result } = await this.raiseModel.create(DTO);
    if (e1) return { error: e1 };

    const { error: e2, result: entrust } = await this.entrustModel.findById(
      raise.EID
    );
    if (e2) return { error: e2 };

    const { error } = await this.chatModel.chat(
      await this.chatModel.getChatID(DTO.uid, entrust.UID),
      DTO.uid,
      formatTime(new Date()),
      "User wants to raise your pet"
    );
    if (error) return { error };
    else return { result };
  }
}

module.exports = RaiseService;
