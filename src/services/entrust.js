const fs = require("fs");

class EntrustService {
  constructor(entrustModel, optionModel) {
    this.entrustModel = entrustModel;
    this.optionModel = optionModel;
  }

  async listEntrustablePets(limit, offset) {
    return await this.entrustModel.listEntrsutablePets(limit, offset);
  }

  async getInfo() {
    const { error: e1, result: housing } = await this.optionModel.listHousing();
    const { error: e2, result: city } = await this.optionModel.listCity();
    const { error: e3, result: breed } = await this.optionModel.listBreed();
    const { error: e4, result: species } = await this.optionModel.listSpecies();
    const { error: e5, result: gender } = await this.optionModel.listGender();

    if (e1 || e2 || e3 || e4 || e5)
      return { error: e1 || e2 || e3 || e4 || e5 };

    return {
      result: {
        housing,
        city,
        breed,
        species,
        gender,
      },
    };
  }

  async list(limit, offset) {
    return await this.entrustModel.list(limit, offset);
  }

  async get(eid) {
    return await this.entrustModel.get(eid);
  }

  async create(DTO) {
    return await this.entrustModel.create(DTO);
  }

  async update(eid, DTO) {
    return await this.entrustModel.update(eid, DTO);
  }

  async delete(eid) {
    return await this.entrustModel.delete(eid);
  }
}

module.exports = EntrustService;
