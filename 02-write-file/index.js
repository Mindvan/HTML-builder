const fs = require('fs');
const path = require('path');
const process = require('process');

console.log('\nPlease type the text you want to add:\n');
const stream = fs.createWriteStream(path.resolve(__dirname, 'text.txt'));
stream.on('error', (e) => console.log(e.message));
process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    exitFromThisTask('exit');
  }

  stream.write(data.toString());
});

const exitFromThisTask = (e) => {
  if (e) {
    console.log('\nWell finished. Have a nice day!');
    process.exit();
  }
};

process.on('SIGINT', exitFromThisTask);
