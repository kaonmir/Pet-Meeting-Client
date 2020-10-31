const Model = require("./model");

class Pet extends Model {
  constructor(conn) {
    super("pid", "Pet", conn);
  }

  async listEntrusted(eid) {
    return await this.list(0, 1000, "eid", eid);
  }

  // Array of petIds
  async validArray(pets) {
    let result = true;

    await pets.forEach(async (pet) => {
      const isExist = await this.exist(pet);
      if (!isExist) result = false;
    });

    return { result };
  }

  async setEntrustAll(eid, pets) {
    let error;
    await pets.forEach(async (pet) => {
      const { error: e1 } = await this.update(pet, { eid });
      if (e1) error = e1;
    });

    if (error) return { error };
    else return { result: true };
  }
  async resetEntrustAll(pets) {
    let error;
    await pets.forEach(async (pet) => {
      const { error: e1 } = await this.update(pet, { eid: null });
      if (e1) error = e1;
    });

    if (error) return { error };
    else return { result: true };
  }
}

module.exports = Pet;
