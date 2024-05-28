const {
  mkdirSync,
  readdirSync,
  statSync,
  renameSync,
  existsSync,
} = require("fs");
const { join, parse, extname } = require("path");

const filesDoesNotWillBeReplaced = ['make-single-files-in-dir.js', 'package.json', 'README.md'];

(async () => {
  const EXTNAME = process.argv[2];
  const WHERE_TO_RUN_SCRIPT = process.argv[3] ? process.argv[3] : "./";

  if (!existsSync(WHERE_TO_RUN_SCRIPT)) {
    console.error("This path does not exist", WHERE_TO_RUN_SCRIPT);
    return;
  }

  readdirSync(WHERE_TO_RUN_SCRIPT).forEach((fileName) => {
    if (filesDoesNotWillBeReplaced.includes(fileName)) {
      return;
    }
    
    if (statSync(join(WHERE_TO_RUN_SCRIPT, fileName)).isFile()) {
      if (EXTNAME && extname(fileName) !== EXTNAME) {
        return;
      }
      
      const folderName = parse(fileName).name;
      const folderPathWithName = join(WHERE_TO_RUN_SCRIPT, folderName);

      if (!existsSync(folderPathWithName)) {
        mkdirSync(folderPathWithName);
        console.log(`directory created: ${folderName}`);
      }

      const oldFilePath = join(WHERE_TO_RUN_SCRIPT, fileName);
      const newFilePath = join(folderPathWithName, fileName);
      renameSync(oldFilePath, newFilePath);
      console.log(`Moved file ${fileName} to directory ${folderName}`);
    }
  });
})();