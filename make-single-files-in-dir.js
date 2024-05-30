const {
  mkdir,
  readdir,
  stat,
  rename,
  access,
} = require("fs").promises;
const {
  join,
  parse,
  extname
} = require("path");

const filesDoesNotWillBeReplaced = ['make-single-files-in-dir.js', 'package.json', 'README.md'];

(async () => {
  const WHERE_TO_RUN_SCRIPT = process.argv[2] ? process.argv[2] : "./";
  const EXTNAME = process.argv[3];
  
  try {
    await access(WHERE_TO_RUN_SCRIPT);
  }
  catch {
    console.error("This path does not exist, or you have no permissions to this path: ", WHERE_TO_RUN_SCRIPT);
    return;
  }

  try {
    const files = await readdir(WHERE_TO_RUN_SCRIPT);
  
    for (const fileName of files) {
      if (filesDoesNotWillBeReplaced.includes(fileName)) {
        continue;
      }

      const filePath = join(WHERE_TO_RUN_SCRIPT, fileName);
      const fileStat = await stat(filePath);

      if (fileStat.isFile()) {
        if (EXTNAME && extname(fileName) !== EXTNAME) {
          continue;
        }

        const folderName = parse(fileName).name;
        const folderPathWithName = join(WHERE_TO_RUN_SCRIPT, folderName);

        try {
          await access(folderPathWithName);
        }
        catch {
          await mkdir(folderPathWithName);
          console.log(`directory created: ${folderName}`);
        }

        const oldFilePath = filePath;
        const newFilePath = join(folderPathWithName, fileName);
        await rename(oldFilePath, newFilePath);
        console.log(`Moved file ${fileName} to directory ${folderName}`);
      }
    }
  }
  catch (error) {
    console.error("Error has accurate:", error);
  }
})();