const fs = require('fs');
const path = require('path');

const oldPath = path.resolve(__dirname, 'files');
const newPath = path.resolve(__dirname, 'files_copy');

fs.mkdir(newPath, { recursive: true }, (e) => {
  if (e) {
    throw e;
  }
  console.log('The FILES_COPY directory was created.');

  fs.readdir(oldPath, (e, files) => {
    for (const file of files) {
      fs.copyFile(
        path.resolve(oldPath, file),
        path.resolve(newPath, file),
        (e) => {
          if (e) {
            throw e;
          }
        },
      );
    }

    fs.readdir(newPath, (e, filesCopied) => {
      const toDelete = filesCopied.filter((file) => !files.includes(file));
      for (const file of toDelete) {
        fs.unlink(path.resolve(newPath, file), (e) => {
          if (e) {
            throw e;
          }
        });
      }
    });
    console.log('The FILES_COPY directory was updated.');
  });
});
