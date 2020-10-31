const fs = require("fs");

class ImageService {
  constructor(imageModel) {
    this.imageModel = imageModel;
  }

  async download(imgId) {
    const { error, result: img } = await this.imageModel.findById(imgId);
    if (error) return { error };

    const filePath = "./images/" + img.Filename;

    if (fs.existsSync(filePath)) {
      var result = {
        fileStream: fs.createReadStream(filePath),
        originalName: img.OriginalName,
      };
      return { result };
    } else {
      return { error: "There's no Image!!" };
    }
  }

  async removeFile(filename) {
    return await this.imageModel.removeFile(filename);
  }
}

module.exports = ImageService;
