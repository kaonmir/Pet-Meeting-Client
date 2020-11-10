const fs = require("fs");

class ImageService {
  constructor(imageModel) {
    this.imageModel = imageModel;
  }

  async downloadWithId(imgId) {
    const { error, result: img } = await this.imageModel.findById(imgId);
    if (error) return { error };

    return await this.downloadWithFilename(img.Filename, img.OriginalName);
  }

  async downloadWithFilename(filename, originalName) {
    const filePath = "./images/" + filename;

    if (fs.existsSync(filePath))
      return {
        result: {
          fileStream: fs.createReadStream(filePath),
          originalName: originalName,
        },
      };
    else return { error: "There's no Image!!" };
  }

  async removeFile(filename) {
    return await this.imageModel.removeFile(filename);
  }
}

module.exports = ImageService;
