const fs = require('fs');
const path = require('path');

fs.readdir(path.resolve(__dirname, 'styles'), (e, files) => {
  console.log(files);
});
