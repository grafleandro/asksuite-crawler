const i2b = require("imageurl-base64");

async function convert(url_image) {
  return new Promise((resolve, reject) => {
    i2b(url_image, async (err, data_image) => {
      return resolve(data_image);
    });
  });
}
module.exports = { convert };