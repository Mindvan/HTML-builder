const fs = require('fs');
const path = require('path');
const { stat } = require('fs');

fs.readdir(
  path.resolve(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (e, files) => {
    if (e) {
      console.log(e.message);
    }

    for (const file of files) {
      const filePath = path.resolve(file.path, file.name);
      if (file.isFile()) {
        stat(filePath, (e, stats) => {

          if (e) {
            console.log(e.message);
          }

          const base = path.basename(file.name);
          const ext = path.extname(file.name).replace('.', '');
          const size = stats.size;
          console.log(`${base} - ${ext} - ${Number(size / 1024).toFixed(3)}kb`);
        });
      }
    }
  },
);
