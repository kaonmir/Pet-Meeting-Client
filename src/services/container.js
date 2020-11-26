// import all models
const Chat = require("../models/chat");
const Image = require("../models/image");
const Option = require("../models/option");
const Pet = require("../models/pet");
const Showoff = require("../models/showoff");
const User = require("../models/user");
const Worry = require("../models/worry");
const Entrust = require("../models/entrust");
const Raise = require("../models/raise");
const Comment = require("../models/comment");

const ImageService = require("./image");
const ShowoffService = require("./showoff");
const UserService = require("./user");
const WorryService = require("./worry");
const EntrustService = require("./entrust");
const RaiseService = require("./raise");
const SocketService = require("./socket");

// import all routers

class Container {
  static container = new Container();

  init(connection, client) {
    // new All models
    const userModel = new User(connection);
    const imageModel = new Image(connection);
    const petModel = new Pet(connection);
    const showoffModel = new Showoff(connection);
    const worryModel = new Worry(connection);
    const entrustModel = new Entrust(connection);
    const raiseModel = new Raise(connection);
    const optionModel = new Option(connection);
    const commentModel = new Comment(connection);

    this.chatModel = new Chat(client);

    // new All services
    this.userService = new UserService(
      userModel,
      imageModel,
      petModel,
      this.chatModel
    );
    this.imageService = new ImageService(imageModel);
    this.showoffService = new ShowoffService(showoffModel, imageModel);
    this.worryService = new WorryService(worryModel, commentModel);
    this.entrustService = new EntrustService(
      entrustModel,
      optionModel,
      petModel
    );
    this.raiseService = new RaiseService(
      raiseModel,
      entrustModel,
      this.chatModel
    );
    this.socketService = new SocketService(this.chatModel);
  }
}

module.exports = Container;
