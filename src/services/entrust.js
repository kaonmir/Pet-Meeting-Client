const fs = require("fs");

class EntrustService {
  constructor(recommenderModel, entrustModel, optionModel, petModel) {
    this.recommenderModel = recommenderModel;
    this.entrustModel = entrustModel;
    this.optionModel = optionModel;
    this.petModel = petModel;
  }

  async listEntrustablePets(uid) {
    const { error: e1, result: pids } = await this.recommenderModel.listPets(
      uid
    );
    const {
      error: e2,
      result: pets,
    } = await this.entrustModel.listEntrustablePets(pids);
    if (e1 || e2) return { error: e1 || e2 };

    var result = [];
    for (var idx = 0; idx < pets.length; idx++) {
      const pet = pets[idx];
      const { result: Housing } = await this.optionModel.EIDHousing(pet.EID);
      result.push({ ...pet, Housing });
    }

    return { result };
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

  async _getOptions(eid) {
    const {
      error: e1,
      result: housings,
    } = await this.entrustModel.listHousings(eid);
    // 이름 고민 중..
    const { error: e2, result: pets } = await this.petModel.listEntrusted(eid);

    if (e1 || e2) return { error: e1 || e2 };
    else return { housings, pets };
  }

  async list(offset, limit) {
    const { error, result: entrusts } = await this.entrustModel.list(
      offset,
      limit
    );
    if (error) return { error };

    const result = await entrusts.map(async (entrust) => {
      // error 처리가 미흡하다.
      const { housings, pets } = await this._getOptions(eid);
      return { ...entrust, housings, pets };
    });
    return { result };
  }

  async get(eid) {
    const { error: e1, result } = await this.entrustModel.findById(eid);
    const { error: e2, housings, pets } = await this._getOptions(eid);
    if (e1 || e2) return { error: e1 || e2 };

    return { result: { ...result, housings, pets } };
  }

  async create(DTO, housings, pets) {
    const {
      result: ishousingvalid,
    } = await this.entrustModel.validHousingArray(housings);
    const { result: ispetvalid } = await this.petModel.validArray(pets);
    if (!ishousingvalid || !ispetvalid) return { error: "Invalid parameters" };

    const { error, result } = await this.entrustModel.create(DTO);
    if (error) return { error };

    const { error: e2 } = this.entrustModel.createHousingsAll(result, housings);
    const { error: e3 } = this.petModel.setEntrustAll(result, pets);

    return { error: e2 || e3, result };
  }

  async update(eid, DTO, housings, pets) {
    const {
      result: ishousingvalid,
    } = await this.entrustModel.validHousingArray(housings);
    const { result: ispetvalid } = await this.petModel.validArray(pets);
    if (!ishousingvalid || !ispetvalid) return { error: "Invalid parameters" };

    const { error: e1 } = await this.entrustModel.update(eid, DTO);
    const { error: e2 } = this.entrustModel.updateHousingsAll(eid, housings);
    const { error: e3 } = this.petModel.updateEntrustAll(eid, pets);

    return { error: e1 || e2 || e3, result: true };
  }

  async delete(eid) {
    return await this.entrustModel.delete(eid);
  }
}

module.exports = EntrustService;
