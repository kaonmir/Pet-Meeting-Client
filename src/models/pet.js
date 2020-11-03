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
  async resetEntrustAll(eid) {
    const { error: e1, result: pets } = await this.list(0, 1000, "eid", eid);
    if (e1) return { error: e1 };

    let error;
    await pets.forEach(async (pet) => {
      const { error: e2 } = await this.update(pet.PID, { eid: null }, true);
      if (e2) error = e2;
    });

    if (error) return { error };
    else return { result: true };
  }
  async updateEntrustAll(eid, pets) {
    const { error: e1 } = await this.resetEntrustAll(eid);
    if (e1) return { error: e1 };

    return await this.setEntrustAll(eid, pets);
  }
}

module.exports = Pet;
