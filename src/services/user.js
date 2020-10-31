class UserService {
  constructor(userModel, imageModel, petModel, chatModel) {
    this.userModel = userModel;
    this.imageModel = imageModel;
    this.petModel = petModel;
    this.chatModel = chatModel;
  }

  // return boolean
  async exist(uid) {
    return await this.userModel.exist("uid", uid);
  }

  // return {error, uid}
  async login(username, password) {
    return await this.userModel.findByUsernameAndPassword(username, password);
    // session 유지
  }

  // return {error, uid}
  async signup(user) {
    const { username, password } = user;
    const { error } = await this.login(username, password);

    if (error) {
      if (user.file) {
        const { result: imgId } = await this.imageModel.create(user.file);
        user.imgId = imgId;
      } else user.imgId = 1; // default image
      delete user.file;

      return await this.userModel.create(user);
    } else {
      if (user.file) this.imageModel.removeFile(user.file.fieldname);
      return { error: "User already exists!" };
    }
  }

  async profile(uid) {
    const { error: e1, result: user } = await this.userModel.findById(uid);
    const { error: e2, result: pets } = await this.petModel.list(
      0,
      10,
      "uid",
      uid
    );
    const { error: e3, result: userIds } = await this.chatModel.members(uid);

    if (e1 || e2 || e3) return { error: e1 || e2 || e3 };

    var chats = [];
    for (var idx = 0; idx < userIds.length; idx++) {
      const { error, result } = await this.userModel.findById(userIds[idx]);
      chats.push(result);
    }

    return {
      result: {
        user,
        pets,
        chats,
      },
    };
  }
}

module.exports = UserService;
