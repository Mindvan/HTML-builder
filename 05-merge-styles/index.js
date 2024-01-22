const fs = require('fs');
const path = require('path');

const styleFile = path.resolve(__dirname, 'project-dist', 'bundle.css');
const styleFolder = path.resolve(__dirname, 'styles');

fs.createWriteStream(path.resolve(styleFile));
fs.readdir(path.resolve(styleFolder), (e, files) => {
  for (const file of files) {
    fs.stat(path.join(styleFolder, file), (e, stats) => {
      if (stats.isFile() && path.extname(file) === '.css') {
        const stream = fs.createReadStream(
          path.resolve(styleFolder, file),
          'utf-8',
        );
        let cssFile = '';

        stream.on('data', (chunk) => (cssFile += chunk));
        stream.on('end', () => {
          fs.appendFile(styleFile, cssFile, (e) => {
            if (e) {
              throw e;
            }
          });
        });
      }
    });
  }
  console.log('The BUNDLE.CSS file was updated.');
});
