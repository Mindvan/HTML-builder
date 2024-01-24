const fs = require('fs');
const path = require('path');

const rootFolder = path.resolve(__dirname, 'project-dist');
const fileNamesArr = ['index.html', 'style.css'];
for (const fileName of fileNamesArr) {
  fs.createWriteStream(path.resolve(rootFolder, fileName));
}

const assetNewFolder = path.resolve(rootFolder, 'assets');
const assetOldFolder = path.resolve(__dirname, 'assets');
fs.mkdir(assetNewFolder, { recursive: true }, (e) => {
  if (e) {
    throw e;
  }

  // заменяем теги в хтмл


  //const HTMLtags = ['header', 'articles', 'footer', 'about'];
  const fileTemplate = path.resolve(__dirname, 'template.html');
  const fileIndex = path.resolve(rootFolder, 'index.html');

  fs.copyFile(fileTemplate, fileIndex, (e) => {
    if (e) {
      throw e;
    }

    fs.readFile(fileIndex, 'utf-8', (e, data) => {
      if (e) {
        throw e;
      }

      const componentsPath = path.resolve(__dirname, 'components');
      fs.readdir(componentsPath, (e, HTMLtags) => {
        if (e) {
          throw e;
        }

        for (const HTMLtag of HTMLtags) {
          const tagName = path.parse(path.basename(HTMLtag)).name;
          const tagPath = path.resolve(
            __dirname,
            'components',
            `${tagName}.html`,
          );

          if (data.includes(HTMLtag)) {
            fs.readFile(tagPath, 'utf-8', (e, component) => {
              if (e) {
                throw e;
              }

              data = data.replace(`{{${HTMLtag}}}`, component);

              fs.writeFile(fileIndex, data, (e) => {
                if (e) {
                  throw e;
                }
              });
            });
          }

        }
      });
    });

    console.log('The templated tags are well replaced.');
  });

  // объединяем стили
  const styleFolder = path.resolve(__dirname, 'styles');
  fs.readdir(styleFolder, (e, files) => {
    for (const file of files) {
      fs.stat(path.resolve(styleFolder, file), (e, stats) => {
        if (stats.isFile() && path.extname(file) === '.css') {
          const stream = fs.createReadStream(
            path.resolve(styleFolder, file),
            'utf-8',
          );
          let cssFile = '';

          stream.on('data', (chunk) => (cssFile += chunk));
          stream.on('end', () => {
            fs.appendFile(
              path.resolve(rootFolder, fileNamesArr[1]),
              cssFile,
              (e) => {
                if (e) {
                  throw e;
                }
              },
            );
          });
        }
      });
    }

    console.log('The style files are well united into a single file.');
  });

  // Читаем папку ASSETS
  fs.readdir(assetOldFolder, (e, subfolders) => {
    // Проходимся по каждой папке внутри папки ASSETS
    for (const subfolder of subfolders) {
      // Проверяем, является ли папка внутри папки ASEETS папкой
      fs.stat(path.resolve(assetOldFolder, subfolder), (e, stats) => {
        if (stats.isDirectory()) {
          // Читаем каждую папку
          fs.mkdir(
            path.resolve(assetNewFolder, subfolder),
            { recursive: true },
            (e) => {
              if (e) {
                throw e;
              }
            },
          );

          fs.readdir(path.resolve(assetOldFolder, subfolder), (e, files) => {
            // Проходимся по каждому файлу каждой папки
            for (const file of files) {
              fs.copyFile(
                path.resolve(assetOldFolder, subfolder, file),
                path.resolve(assetNewFolder, subfolder, file),
                (e) => {
                  if (e) {
                    throw e;
                  }
                },
              );
            }

            fs.readdir(
              path.resolve(assetNewFolder, subfolder),
              (e, filesCopied) => {
                const toDelete = filesCopied.filter(
                  (file) => !files.includes(file),
                );
                for (const file of toDelete) {
                  fs.unlink(
                    path.resolve(path.resolve(assetNewFolder, subfolder), file),
                    (e) => {
                      if (e) {
                        throw e;
                      }
                    },
                  );
                }
              },
            );
          });
        }
      });
    }

    console.log('The ASSETS folder is well copied.');
  });
});
