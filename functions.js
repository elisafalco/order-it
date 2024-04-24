const fs = require("fs");
const imageThumbnail = require("image-thumbnail");
const path = require("path");

/**
 * deleteAllThumbnails
 */
async function deleteAllThumbnails() {
  fs.readdir('static/thumbnails', (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join('static/thumbnails', file), (err) => {
        if (err) throw err;
      });
    }
  });
}
/**
 * createThumbnails
 * @param pictures
 */
async function createThumbnails(pictures) {
  const options = { width: 200, height: 200 }
  await deleteAllThumbnails();

  for (const picture of pictures) {
    try {
      const thumbnail = await imageThumbnail(`static/pictures/${picture}`, options);
  
      fs.writeFile(`static/thumbnails/${picture}`, thumbnail, err => {
        if (err) {
          console.error(err);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };
}

/**
 * renameFiles
 * @param request 
 */
async function renameFiles(request) {
  // Rename the file 
  if (request.body.order) {
    let prefix = request.body.prefix || '';

    for (const [index, picture] of request.body.order.entries()) {
      const extension = picture.split('.')[picture.split('.').length - 1];
      fs.rename(
        `static/pictures/${picture}`,
        `static/pictures/${prefix}${index + 1}.${extension}`,
        (err) => {
          if (err) {
            console.log("Error occurred during file renaming", error);
          }
        });
      }
    }

  }


module.exports = { createThumbnails, renameFiles }